import axios from "axios";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import { Post } from "@prisma/client";
import CachedPost from "@/models/types/CachedPost";
import AppConstants from "@/constants/AppConstants";
import UnfurledData from "@/models/types/UnfurledData";
import IPostService from "@/models/interfaces/IPostService";
import GroupService from "@/resources/groups/group.service";
import CreatePostDto from "@/dtos/createPost.dto";
import RedisDatabase from "@/database/redis.database";
import HttpException from "@/exceptions/httpException";
import PostReactionDto from "@/dtos/postReaction.dto";
import PostgresDatabase from "@/database/postgres.database";

@injectable()
class PostService implements IPostService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly redisDatabaseInstance: RedisDatabase,
		private readonly groupService: GroupService,
	) {}

	public createPost = async (userId: string, postData: CreatePostDto): Promise<Post> => {
		try {
			await this.groupService.checkGroupExistence(postData.groupSlug);

			return await this.databaseInstance.postRepository.create({
				data: {
					content: postData.content,
					title: postData.title,
					creator: { connect: { id: userId } },
					group: { connect: { id: postData.groupSlug } },
				},
				include: {
					creator: true,
					postReactions: true,
					comments: true,
					group: true,
				},
			});
		} catch (error: any) {
			throw error;
		}
	};

	public unfurlLink = async (url: string): Promise<UnfurledData> => {
		try {
			const properUrl = new URL(url);
			const href = properUrl.searchParams.get("url");

			if (!href) {
				console.log("Invalid href provided");
				throw new HttpException(httpStatus.BAD_REQUEST, "Invalid href provided");
			}

			const { data } = await axios.get(href);

			const titleMatch = (data as string).match(/<title>(.*?)<\/title>/);
			const title = titleMatch?.[1] || "";

			const descriptionMatch = (data as string).match(
				/<meta name="description" content="(.*?)"/,
			);
			const description = descriptionMatch?.[1] || "";

			const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);
			const imageUrl = imageMatch?.[1] || "";

			return {
				unfurledData: JSON.stringify({
					success: 1,
					meta: {
						title,
						description,
						image: {
							url: imageUrl,
						},
					},
				}),
			};
		} catch (error) {
			throw error;
		}
	};

	deletePost(postId: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	public react = async (userId: string, postReactionInfo: PostReactionDto): Promise<void> => {
		try {
			const post = await this.checkPostExistence(postReactionInfo.postSlug, userId);

			const alreadyReacted = await this.databaseInstance.postReactionRepository.findFirst({
				where: {
					userId,
					postId: postReactionInfo.postSlug,
				},
			});

			let userVote = 0;
			if (alreadyReacted) {
				if (alreadyReacted.type === postReactionInfo.reaction) {
					await this.databaseInstance.postReactionRepository.delete({
						where: {
							userId_postId_type: {
								type: postReactionInfo.reaction,
								postId: postReactionInfo.postSlug,
								userId,
							},
						},
					});
					userVote -= 1;
				} else {
					await this.databaseInstance.postReactionRepository.update({
						where: {
							userId_postId_type: {
								type: alreadyReacted.type,
								postId: postReactionInfo.postSlug,
								userId,
							},
						},
						data: { type: postReactionInfo.reaction },
					});
					userVote += 0;
				}
			} else {
				await this.databaseInstance.postReactionRepository.create({
					data: {
						post: { connect: { id: postReactionInfo.postSlug } },
						user: { connect: { id: userId } },
						type: postReactionInfo.reaction,
					},
				});
				userVote += 1;
			}

			if (post._count.postReactions + userVote >= AppConstants.CACHED_POSTS_COUNT) {
				const cachedPost: CachedPost = {
					id: post.id,
					content: post.content,
					title: post.title,
					createdAt: post.createdAt,
					creatorUsername: post.creator.username,
					currentUserReaction: postReactionInfo.reaction,
				};
				await this.redisDatabaseInstance.redisInstance.hset(`post:${post.id}`, cachedPost);
			}
			return;
		} catch (error) {
			throw error;
		}
	};

	public getPost = async (userId: string, postSlug: string): Promise<Post> => {
		try {
			const post = await this.databaseInstance.postRepository.findUnique({
				where: { id: postSlug },
				include: { postReactions: true, group: true, comments: true, creator: true },
			});

			if (!post) {
				throw new HttpException(httpStatus.BAD_REQUEST, "The post does not exist.");
			}

			return post;
		} catch (error) {
			throw error;
		}
	};

	public getInitialFeedPosts = async (userId: string): Promise<Post[]> => {
		try {
			const followedGroups = await this.databaseInstance.groupRepository.findMany({
				where: { groupMembers: { some: { id: userId } } },
				select: { id: true },
			});
			const followedGroupIds = followedGroups.map((followedGroup) => followedGroup.id);

			if (followedGroupIds.length === 0) {
				return [];
			}

			return await this.databaseInstance.postRepository.findMany({
				where: { groupId: { in: followedGroupIds } },
				include: {
					creator: true,
					postReactions: true,
					comments: true,
					group: true,
				},
				orderBy: { createdAt: "desc" },
				take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
			});
		} catch (error) {
			throw error;
		}
	};

	public getUserPosts = async (
		userId: string,
		limit: number,
		page: number,
		groupSlug?: string,
	): Promise<Post[]> => {
		try {
			let where = {};
			if (groupSlug) {
				const group = await this.groupService.checkGroupExistence(groupSlug);

				if (!group) {
					console.log("The group does not exist");
					throw new HttpException(httpStatus.BAD_REQUEST, "Posts could not be fetched");
				}

				where = { groupId: groupSlug };
			} else {
				const followedGroups = await this.databaseInstance.groupRepository.findMany({
					where: { groupMembers: { some: { id: userId } } },
					select: { id: true },
				});

				const followedGroupIds = followedGroups.map((followedGroup) => followedGroup.id);

				where = { group: { id: { in: followedGroupIds } } };
			}

			return await this.databaseInstance.postRepository.findMany({
				where,
				take: limit,
				skip: (page - 1) * limit,
				orderBy: {
					createdAt: "desc",
				},
				include: {
					creator: true,
					group: true,
					postReactions: true,
					comments: true,
				},
			});
		} catch (error) {
			throw error;
		}
	};

	updatePost(postInfo: Partial<Post>): Promise<void> {
		return Promise.resolve(undefined);
	}

	public checkPostExistence = async (slug: string, userId?: string) => {
		try {
			const post = await this.databaseInstance.postRepository.findFirst({
				where: { id: slug },
				include: {
					creator: !!userId,
					_count: {
						select: { postReactions: true },
					},
				},
			});

			if (!post) {
				console.log("Post does not exist.");
				throw new HttpException(httpStatus.BAD_REQUEST, "The post does not exist");
			}
			return post;
		} catch (error) {
			throw error;
		}
	};
}

export default PostService;

import axios from "axios";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import { Post } from "@prisma/client";
import UnfurledData from "@/models/types/UnfurledData";
import IPostService from "@/models/interfaces/IPostService";
import GroupService from "@/resources/groups/group.service";
import CreatePostDto from "@/dtos/createPost.dto";
import RedisDatabase from "@/database/redis.database";
import HttpException from "@/exceptions/httpException";
import PostgresDatabase from "@/database/postgres.database";
import PostReactionDto from "@/dtos/postReaction.dto";
import CachedPost from "@/models/types/CachedPost";
import AppConstants from "@/constants/AppConstants";

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

	getUserPosts(userId: string): Promise<Post[]> {
		return Promise.resolve([]);
	}

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
						select: { postReactins: tru },
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

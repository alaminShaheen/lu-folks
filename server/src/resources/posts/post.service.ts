import axios from "axios";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import { Comment, Post } from "@prisma/client";
import AppConstants from "@/constants/AppConstants";
import IPostService from "@/models/interfaces/IPostService";
import GroupService from "@/resources/groups/group.service";
import CreatePostDto from "@/dtos/createPost.dto";
import RedisDatabase from "@/database/redis.database";
import HttpException from "@/exceptions/httpException";
import PostgresDatabase from "@/database/postgres.database";
import PaginatedResponse from "@/models/PaginatedResponse";

@injectable()
class PostService implements IPostService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly redisDatabaseInstance: RedisDatabase,
		private readonly groupService: GroupService,
	) {}

	public createPost = async (userId: string, postData: CreatePostDto): Promise<Post> => {
		try {
			const group = await this.databaseInstance.groupRepository.findUnique({
				where: {
					id: postData.groupSlug,
					groupMembers: { some: { id: userId } },
				},
			});

			if (!group) {
				throw new HttpException(
					httpStatus.BAD_REQUEST,
					"You do not have permission to create post",
				);
			}

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

	public unfurlLink = async (url: string): Promise<string> => {
		try {
			const properUrl = new URL(url);

			if (!properUrl) {
				console.log("Invalid href provided");
				throw new HttpException(httpStatus.BAD_REQUEST, "Invalid href provided");
			}

			const { data } = await axios.get(properUrl.href);

			const titleMatch = (data as string).match(/<title>(.*?)<\/title>/);
			const title = titleMatch?.[1] || "";

			const descriptionMatch = (data as string).match(
				/<meta name="description" content="(.*?)"/,
			);
			const description = descriptionMatch?.[1] || "";

			const imageMatch = data.match(/<meta property="og:image" content="(.*?)"/);
			const imageUrl = imageMatch?.[1] || "";

			return JSON.stringify({
				success: 1,
				meta: {
					title,
					description,
					image: {
						url: imageUrl,
					},
				},
			});
		} catch (error) {
			throw error;
		}
	};

	public deletePost = async (userId: string, postId: string): Promise<Post> => {
		try {
			await this.checkPostExistence(postId, userId);

			return await this.databaseInstance.postRepository.delete({
				where: { id: postId },
				include: {
					creator: true,
					postReactions: true,
					comments: true,
					group: true,
				},
			});
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
		cursor?: string,
		groupSlug?: string,
	): Promise<PaginatedResponse<Post>> => {
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

			const posts = await this.databaseInstance.postRepository.findMany({
				where,
				include: {
					creator: true,
					group: true,
					postReactions: true,
					comments: { where: { replyTo: undefined } },
				},
				orderBy: {
					createdAt: "desc",
				},
				take: AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
				skip: cursor ? 1 : undefined,
				cursor: cursor ? { id: cursor } : undefined,
			});

			return {
				nextId:
					posts.length === AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH
						? posts[posts.length - 1].id
						: undefined,
				data: posts,
			};
		} catch (error) {
			throw error;
		}
	};

	public getPostComments = async (postId: string): Promise<Comment[]> => {
		try {
			await this.checkPostExistence(postId);
			return await this.databaseInstance.commentRepository.findMany({
				where: { postId, replyToCommentId: null },
				include: {
					commentReactions: true,
					commenter: true,
				},
			});
		} catch (error) {
			throw error;
		}
	};

	public updatePost = async (
		userId: string,
		postId: string,
		postInfo: UpdatePostDt,
	): Promise<Post> => {
		try {
			await this.checkPostExistence(postId, userId);

			return await this.databaseInstance.postRepository.update({
				where: { id: postId },
				data: {
					content: postInfo.content,
					title: postInfo.title,
				},
				include: { creator: true, group: true ,
			});
		} catch (error) {
			throw error;
		}
	};

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
			} else if (userId && post.creator.id !== userId) {
				throw new HttpException(
					httpStatus.BAD_REQUEST,
					"You do not have permission to do this operation"
				);
			}
			return post;
		} catch (error) {
			throw error;
		}
	};
}

export default PostService;

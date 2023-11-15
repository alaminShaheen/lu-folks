import IPostReactionService from "@/models/interfaces/IPostReactionService";
import PostgresDatabase from "@/database/postgres.database";
import PostService from "@/resources/posts/post.service";
import PostReactionDto from "@/dtos/postReaction.dto";
import { injectable } from "tsyringe";
import { ReactionType, User } from "@prisma/client";

@injectable()
class PostReactionService implements IPostReactionService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly postService: PostService,
	) {}

	public getLikeReactors = async (postSlug: string): Promise<User[]> => {
		try {
			await this.postService.checkPostExistence(postSlug);

			return await this.databaseInstance.userRepository.findMany({
				where: { postReactions: { some: { postId: postSlug, type: ReactionType.LIKE } } },
			});
		} catch (error) {
			throw error;
		}
	};

	public getDislikeReactors = async (postSlug: string): Promise<User[]> => {
		try {
			await this.postService.checkPostExistence(postSlug);

			return await this.databaseInstance.userRepository.findMany({
				where: { postReactions: { some: { postId: postSlug, type: ReactionType.UNLIKE } } },
			});
		} catch (error) {
			throw error;
		}
	};

	public react = async (userId: string, postReactionInfo: PostReactionDto): Promise<void> => {
		try {
			const post = await this.postService.checkPostExistence(
				postReactionInfo.postSlug,
				userId,
			);

			const alreadyReacted = await this.databaseInstance.postReactionRepository.findFirst({
				where: {
					userId,
					postId: postReactionInfo.postSlug,
				},
			});

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
				}
			} else {
				await this.databaseInstance.postReactionRepository.create({
					data: {
						post: { connect: { id: postReactionInfo.postSlug } },
						user: { connect: { id: userId } },
						type: postReactionInfo.reaction,
					},
				});
			}
			return;
		} catch (error) {
			throw error;
		}
	};
}

export default PostReactionService;

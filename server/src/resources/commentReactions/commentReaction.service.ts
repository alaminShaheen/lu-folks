import PostgresDatabase from "@/database/postgres.database";
import { injectable } from "tsyringe";
import { ReactionType, User } from "@prisma/client";
import ICommentReactionService from "@/models/interfaces/ICommentReactionService";
import CommentService from "@/resources/comments/comment.service";
import CommentReactionDto from "@/dtos/commentReaction.dto";

@injectable()
class CommentReactionService implements ICommentReactionService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly commentService: CommentService,
	) {}

	public getLikeReactors = async (commentSlug: string): Promise<User[]> => {
		try {
			await this.commentService.checkCommentExistence(commentSlug);

			return await this.databaseInstance.userRepository.findMany({
				where: {
					commentReactions: { some: { commentId: commentSlug, type: ReactionType.LIKE } },
				},
			});
		} catch (error) {
			throw error;
		}
	};

	public getDislikeReactors = async (commentSlug: string): Promise<User[]> => {
		try {
			await this.commentService.checkCommentExistence(commentSlug);

			return await this.databaseInstance.userRepository.findMany({
				where: {
					commentReactions: {
						some: { commentId: commentSlug, type: ReactionType.UNLIKE },
					},
				},
			});
		} catch (error) {
			throw error;
		}
	};

	public react = async (
		userId: string,
		commentReactionInfo: CommentReactionDto,
	): Promise<void> => {
		try {
			const comment = await this.commentService.checkCommentExistence(
				commentReactionInfo.commentSlug,
			);

			const alreadyReacted = await this.databaseInstance.commentReactionRepository.findFirst({
				where: {
					userId,
					commentId: commentReactionInfo.commentSlug,
				},
			});

			if (alreadyReacted) {
				if (alreadyReacted.type === commentReactionInfo.reaction) {
					await this.databaseInstance.commentReactionRepository.delete({
						where: {
							userId_commentId_type: {
								userId,
								type: commentReactionInfo.reaction,
								commentId: commentReactionInfo.commentSlug,
							},
						},
					});
				} else {
					await this.databaseInstance.commentReactionRepository.update({
						where: {
							userId_commentId_type: {
								type: alreadyReacted.type,
								commentId: commentReactionInfo.commentSlug,
								userId,
							},
						},
						data: { type: commentReactionInfo.reaction },
					});
				}
			} else {
				await this.databaseInstance.commentReactionRepository.create({
					data: {
						comment: { connect: { id: commentReactionInfo.commentSlug } },
						user: { connect: { id: userId } },
						type: commentReactionInfo.reaction,
					},
				});
			}
		} catch (error) {
			throw error;
		}
	};
}

export default CommentReactionService;

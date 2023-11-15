import httpStatus from "http-status";
import { injectable } from "tsyringe";
import PostService from "@/resources/posts/post.service";
import { Comment } from "@prisma/client";
import HttpException from "@/exceptions/httpException";
import ICommentService from "@/models/interfaces/ICommentService";
import PostgresDatabase from "@/database/postgres.database";
import CreateCommentDto from "@/dtos/createComment.dto";
import UpdateCommentDto from "@/dtos/updateComment.dto";

@injectable()
class CommentService implements ICommentService {
	constructor(
		private readonly databaseInstance: PostgresDatabase,
		private readonly postService: PostService,
	) {}

	public createComment = async (
		commentInfo: CreateCommentDto,
		userId: string,
	): Promise<Comment> => {
		try {
			await this.postService.checkPostExistence(commentInfo.postId);
			return await this.databaseInstance.commentRepository.create({
				data: {
					comment: commentInfo.comment,
					commenter: { connect: { id: userId } },
					post: { connect: { id: commentInfo.postId } },
				},
				include: { commenter: true, commentReactions: true },
			});
		} catch (error) {
			throw error;
		}
	};

	public deleteComment = async (commentId: string): Promise<void> => {
		try {
			await this.databaseInstance.commentRepository.delete({ where: { id: commentId } });
		} catch (error) {
			throw error;
		}
	};

	public getComment = async (commentId: string): Promise<Comment> => {
		try {
			const comment = await this.databaseInstance.commentRepository.findUnique({
				where: { id: commentId, replyToCommentId: undefined },
				include: { commentReactions: true, commenter: true },
			});

			if (!comment) {
				throw new HttpException(httpStatus.BAD_REQUEST, "This comment does not exist");
			}

			return comment;
		} catch (error) {
			throw error;
		}
	};

	public updateComment = async (commentInfo: UpdateCommentDto): Promise<Comment> => {
		try {
			await this.checkCommentExistence(commentInfo.commentId);

			return await this.databaseInstance.commentRepository.update({
				data: { comment: commentInfo.comment },
				where: { id: commentInfo.commentId },
			});
		} catch (error) {
			throw error;
		}
	};

	public checkCommentExistence = async (commentId: string) => {
		try {
			const comment = await this.databaseInstance.commentRepository.findUnique({
				where: { id: commentId },
			});

			if (!comment) {
				throw new HttpException(httpStatus.BAD_REQUEST, "This comment does not exist");
			}

			return comment;
		} catch (error) {
			throw error;
		}
	};
}

export default CommentService;
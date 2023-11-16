import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import errorHandler from "@/middlewares/errorHandler";
import ICommentService from "@/models/interfaces/ICommentService";
import verifyAuthentication from "@/middlewares/verifyAuthentication";

@injectable()
class CommentController extends Controller {
	constructor(@inject("ICommentService") private readonly commentService: ICommentService) {
		super("/comment");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router
			.route(`${this.path}/:commentSlug`)
			.all(verifyAuthentication)
			.patch(this.updateComment)
			.delete(this.deleteComment);
		this.router.route(this.path).all(verifyAuthentication).post(this.createComment);
		this.router
			.route(`${this.path}/:commentSlug/replies`)
			.all(verifyAuthentication)
			.get(this.getCommentReplies);
	};

	private getCommentReplies = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const comments = await this.commentService.getCommentReplies(
				request.params.commentSlug,
			);
			return response.status(httpStatus.OK).send(comments);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private createComment = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newComment = await this.commentService.createComment(
				request.body,
				request.user?.userId!,
			);
			return response.status(httpStatus.CREATED).send(newComment);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private deleteComment = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const deletedComment = await this.commentService.deleteComment(
				request.params.commentSlug,
				request.user?.userId!,
			);
			return response.status(httpStatus.OK).send(deletedComment);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private updateComment = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const updatedComment = await this.commentService.updateComment(
				request.body,
				request.user?.userId!,
			);
			return response.status(httpStatus.OK).send(updatedComment);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default CommentController;

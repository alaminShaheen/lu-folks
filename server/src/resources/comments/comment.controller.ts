import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import errorHandler from "@/middlewares/errorHandler";
import verifyAuthentication from "@/middlewares/verifyAuthentication";
import ICommentService from "@/models/interfaces/ICommentService";

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
			.get(this.getComment)
			.patch(this.updateComment)
			.delete(this.deleteComment);
		this.router.route(this.path).all(verifyAuthentication).post(this.createComment);
	};

	private getComment = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const comment = await this.commentService.getComment(request.params.commentSlug);
			return response.status(httpStatus.OK).send(comment);
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
			await this.commentService.deleteComment(request.params.commentSlug);
			return response.sendStatus(httpStatus.NO_CONTENT);
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
			const updatedComment = await this.commentService.updateComment(request.body);
			return response.status(httpStatus.OK).send(updatedComment);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default CommentController;

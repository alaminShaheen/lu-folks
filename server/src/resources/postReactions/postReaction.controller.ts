import Controller from "@/abstracts/controller";
import { inject, injectable } from "tsyringe";
import verifyAuthentication from "@/middlewares/verifyAuthentication";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import errorHandler from "@/middlewares/errorHandler";
import IPostReactionService from "@/models/interfaces/IPostReactionService";

@injectable()
class PostReactionController extends Controller {
	constructor(
		@inject("IPostReactionService") private readonly postReactionService: IPostReactionService,
	) {
		super("/reaction");
		this.initialiseRoutes();
	}

	public getLikeReactors = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			await this.postReactionService.react(request.user?.userId!, request.body);
			return response.sendStatus(httpStatus.OK);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	public getDislikeReactors = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			await this.postReactionService.react(request.user?.userId!, request.body);
			return response.sendStatus(httpStatus.OK);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	public react = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			await this.postReactionService.react(request.user?.userId!, request.body);
			return response.sendStatus(httpStatus.OK);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	protected initialiseRoutes = () => {
		this.router.route(`${this.path}`).patch(verifyAuthentication, this.react);
		this.router
			.route(`${this.path}/likes/:postSlug`)
			.get(verifyAuthentication, this.getLikeReactors);
		this.router
			.route(`${this.path}/unlikes/:postSlug`)
			.get(verifyAuthentication, this.getDislikeReactors);
	};
}

export default PostReactionController;

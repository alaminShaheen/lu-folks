import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import PostEntity from "@/database/entities/post.entity";
import errorHandler from "@/middlewares/errorHandler";
import DtoValidator from "@/middlewares/dtoValidator";
import IPostService from "@/models/interfaces/IPostService";
import RegisterUserDto from "@/dtos/registerUser.dto";
import verifyAuthentication from "@/middlewares/verifyAuthentication";

@injectable()
class PostController extends Controller {
	constructor(@inject("IPostService") private readonly postService: IPostService) {
		super("/posts");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router
			.route(this.path)
			.get(verifyAuthentication, this.getPosts)
			.post(verifyAuthentication, DtoValidator(RegisterUserDto), this.createPost)
			.put(verifyAuthentication, this.updatePost)
			.delete(verifyAuthentication, this.deletePost);
	};

	private getPosts = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const posts = await this.postService.getUserPosts(request.user?.userId!);
			return response.status(httpStatus.OK).send(posts);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private createPost = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newPost = await this.postService.createPost();
			return response.status(httpStatus.CREATED).send(newPost);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private updatePost = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newUser = await this.postService.updatePost(request.body as Partial<PostEntity>);
			return response.status(httpStatus.OK).send(newUser);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private deletePost = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newUser = await this.postService.deletePost(request.body.postId as string);
			return response.sendStatus(httpStatus.NO_CONTENT);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default PostController;
import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { Post } from "@prisma/client";
import Controller from "@/abstracts/controller";
import errorHandler from "@/middlewares/errorHandler";
import DtoValidator from "@/middlewares/dtoValidator";
import IPostService from "@/models/interfaces/IPostService";
import CreatePostDto from "@/dtos/createPost.dto";
import verifyAuthentication from "@/middlewares/verifyAuthentication";

@injectable()
class PostController extends Controller {
	constructor(@inject("IPostService") private readonly postService: IPostService) {
		super("/post");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router.route(`${this.path}/unfurl-link`).get(verifyAuthentication, this.unfurlLink);
		this.router.route(`${this.path}/react`).patch(verifyAuthentication, this.react);
		this.router
			.route(this.path)
			.post(verifyAuthentication, DtoValidator(CreatePostDto), this.createPost);
		this.router.route(this.path).put(this.updatePost);
		this.router.route(this.path).delete(this.deletePost);
		this.router.route(this.path).get(verifyAuthentication, this.getPosts);
		this.router.route(`${this.path}/:slug`).get(verifyAuthentication, this.getPost);
		this.router.route(`${this.path}/feed`).get(verifyAuthentication, this.getInitialFeedPosts);
	};

	private getPosts = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const limit = Number(request.query.limit);
			const page = Number(request.query.page);
			const groupSlug: string | undefined = request.query.slug as string | undefined;
			const posts = await this.postService.getUserPosts(
				request.user?.userId!,
				limit,
				page,
				groupSlug,
			);
			return response.status(httpStatus.OK).send(posts);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private getPost = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const postSlug = request.params.slug;
			const posts = await this.postService.getPost(request.user?.userId!, postSlug);
			return response.status(httpStatus.OK).send(posts);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private getInitialFeedPosts = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const posts = await this.postService.getInitialFeedPosts(request.user?.userId!);
			return response.status(httpStatus.OK).send(posts);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private react = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			await this.postService.react(request.user?.userId!, request.body);
			return response.sendStatus(httpStatus.OK);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private unfurlLink = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const unfurlData = await this.postService.unfurlLink(request.url);
			return response.status(httpStatus.OK).send(unfurlData);
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
			const newPost = await this.postService.createPost(request.user?.userId!, request.body);
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
			const newUser = await this.postService.updatePost(request.body as Partial<Post>);
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

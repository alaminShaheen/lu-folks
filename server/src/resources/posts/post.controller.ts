import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
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
		this.router
			.route(this.path)
			.all(verifyAuthentication)
			.post(DtoValidator(CreatePostDto), this.createPost)
			.get(this.getPosts);
		this.router.route(`${this.path}/feed`).get(verifyAuthentication, this.getInitialFeedPosts);
		this.router
			.route(`${this.path}/:slug/comments`)
			.get(verifyAuthentication, this.getPostComments);
		this.router
			.route(`${this.path}/:slug`)
			.all(verifyAuthentication)
			.get(this.getPost)
			.patch(this.updatePost)
			.delete(this.deletePost);
	};

	private getPostComments = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const comments = await this.postService.getPostComments(request.params.slug);
			return response.status(httpStatus.OK).send(comments);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private getPosts = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const cursorId = request.query.cursor as string | undefined;
			const groupSlug: string | undefined = request.query.slug as string | undefined;
			const posts = await this.postService.getUserPosts(
				request.user?.userId!,
				cursorId,
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

	private unfurlLink = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const unfurlData = await this.postService.unfurlLink(request.query.url as string);
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
			const updatedPost = await this.postService.updatePost(
				request.user?.userId!,
				request.params.slug,
				request.body,
			);
			return response.status(httpStatus.OK).send(updatedPost);
		} catch (error: unknown) {
			console.log(error);
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private deletePost = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const deletedPost = await this.postService.deletePost(
				request.user?.userId!,
				request.params.slug as string,
			);
			return response.status(httpStatus.OK).send(deletedPost);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default PostController;

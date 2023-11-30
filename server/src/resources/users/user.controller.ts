import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import IUserService from "@/models/interfaces/IUserService";
import errorHandler from "@/middlewares/errorHandler";
import DtoValidator from "@/middlewares/dtoValidator";
import RegisterUserDto from "@/dtos/registerUser.dto";
import verifyAuthentication from "@/middlewares/verifyAuthentication";
import UpdateUserDto from "@/dtos/updateUser.dto";

@injectable()
class UserController extends Controller {
	constructor(@inject("IUserService") private readonly userService: IUserService) {
		super("/user");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router
			.route(this.path)
			.get(verifyAuthentication, this.getUsers)
			.post(DtoValidator(RegisterUserDto), this.createUser)
			.patch(verifyAuthentication, DtoValidator(UpdateUserDto), this.updateUser);
		this.router
			.route(`${this.path}/single-user/:userId`)
			.get(verifyAuthentication, this.getUser);
		this.router
			.route(`${this.path}/current-user`)
			.get(verifyAuthentication, this.getCurrentUser);
	};

	private getUsers = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const result = await this.userService.getUsers();
			return response.status(httpStatus.OK).send(result);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private getUser = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const result = await this.userService.getUser(request.params.userId);
			return response.status(httpStatus.OK).send(result);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private getCurrentUser = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const result = await this.userService.getCurrentUser(request.user?.userId!);
			return response.status(httpStatus.OK).send(result);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private updateUser = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const updatedUser = await this.userService.updateUser(
				request.user?.userId!,
				request.body,
			);
			return response.status(httpStatus.OK).send(updatedUser);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};

	private createUser = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newUser = await this.userService.createAndSaveUser(request.body);
			return response.status(httpStatus.OK).send(newUser);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default UserController;

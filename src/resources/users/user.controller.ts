import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import errorHandler from "@/middlewares/errorHandler";
import DtoValidator from "@/middlewares/dtoValidator";
import IUserService from "@/models/IUserService";
import CreateUserDto from "@/dtos/create-user.dto";

@injectable()
class UserController extends Controller {
	constructor(@inject("IUserService") private readonly userService: IUserService) {
		super("/users");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router
			.route(this.path)
			.get(this.getUsers)
			.post(DtoValidator(CreateUserDto), this.createUser);
	};

	private getUsers = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const result = await this.userService.getUsers();
			return response.status(httpStatus.OK).send(result);
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
			const newUser = await this.userService.createUser(request.body);
			return response.status(httpStatus.OK).send(newUser);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default UserController;

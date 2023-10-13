import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import UserService from "@/resources/users/user.service";
import errorHandler from "@/middlewares/errorHandler";
import DtoValidator from "@/middlewares/dtoValidator";
import CreateUserDto from "@/dtos/create-user.dto";

class UserController extends Controller {
	constructor(private readonly userService: UserService) {
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

	private createUser = (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			return response.status(httpStatus.OK).send(request.body);
		} catch (error: unknown) {
			errorHandler(error as any, request, response, nextFunction);
		}
	};
}

export default UserController;

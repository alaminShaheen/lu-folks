import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import IUserService from "@/models/IUserService";
import errorHandler from "@/middlewares/errorHandler";
import DtoValidator from "@/middlewares/dtoValidator";
import RegisterUserDto from "@/dtos/registerUser.dto";
import verifyAuthentication from "@/middlewares/verifyAuthentication";

@injectable()
class UserController extends Controller {
	constructor(@inject("IUserService") private readonly userService: IUserService) {
		super("/users");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = () => {
		this.router
			.route(this.path)
			.get(verifyAuthentication, this.getUsers)
			.post(DtoValidator(RegisterUserDto), this.createUser);
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

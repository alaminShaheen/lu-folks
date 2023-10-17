import httpStatus from "http-status";
import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import Controller from "@/abstracts/controller";
import LoginUserDto from "@/dtos/loginUser.dto";
import IAuthService from "@/models/IAuthService";
import dtoValidator from "@/middlewares/dtoValidator";
import HttpException from "@/exceptions/httpException";
import RegisterUserDto from "@/dtos/registerUser.dto";
import verifyAuthentication from "@/middlewares/verifyAuthentication";

@injectable()
class AuthController extends Controller {
	constructor(@inject("IAuthService") private readonly authService: IAuthService) {
		super("/auth");
		this.initialiseRoutes();
	}

	protected initialiseRoutes(): void {
		this.router
			.route(`${this.path}/register`)
			.post(dtoValidator(RegisterUserDto), this.register);
		this.router.route(`${this.path}/refresh-token`).post(this.refreshToken);
		this.router.route(`${this.path}/login`).post(dtoValidator(LoginUserDto), this.login);
		this.router.route(`${this.path}/logout`).delete(verifyAuthentication, this.logout);
		this.router
			.route(`${this.path}/check-validity`)
			.get(verifyAuthentication, this.checkValidity);
	}

	private register = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const { accessToken, refreshToken } = await this.authService.register(request.body);
			response.cookie("jwt", refreshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
				secure: true,
				sameSite: "none",
			});
			return response.status(httpStatus.CREATED).send({ accessToken });
		} catch (error) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred."),
				);
			}
		}
	};

	private login = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const { accessToken, refreshToken } = await this.authService.login(request.body);
			response.cookie("jwt", refreshToken, {
				httpOnly: true,
				maxAge: 24 * 60 * 60 * 1000,
				secure: true,
				sameSite: "none,
			});
			return response.status(httpStatus.CREATED).send({ accessToken });
		} catch (error) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred."),
				);
			}
		}
	};

	private logout = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			await this.authService.logout(request.user?.userId!);
			response.clearCookie("jwt", {
				httpOnly: true,
				secure: true,
				sameSite: "none"
			});
			return response.sendStatus(httpStatus.OK);
		} catch (error) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred."),
				);
			}
		}
	};

	private refreshToken = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const { accessToken } = await this.authService.refreshToken(request.cookies);
			return response.status(httpStatus.CREATED).send({ accessToken });
		} catch (error) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred."),
				);
			}
		}
	};

	private checkValidity = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const data = await this.authService.checkValidity(request.headers.authorization);
			return response.status(httpStatus.OK).send(data);
		} catch (error) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred."),
				);
			}
		}
	};
}

export default AuthController;

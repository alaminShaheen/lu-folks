import Controller from "@/abstracts/controller";
import { inject, injectable } from "tsyringe";
import IGroupService from "@/models/interfaces/IGroupService";
import DtoValidator from "@/middlewares/dtoValidator";
import verifyAuthentication from "@/middlewares/verifyAuthentication";
import CreateGroupDto from "@/dtos/createGroup.dto";
import { NextFunction, Request, Response } from "express";
import HttpException from "@/exceptions/httpException";
import httpStatus from "http-status";

@injectable()
class GroupController extends Controller {
	constructor(@inject("IGroupService") private readonly groupService: IGroupService) {
		super("/group");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = (): void => {
		console.log(this.path);
		this.router
			.route(this.path)
			.post(verifyAuthentication, DtoValidator(CreateGroupDto), this.createGroup);
		this.router.route(`${this.path}/:slug`).get(verifyAuthentication, this.getGroup);
	};

	private createGroup = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newGroup = await this.groupService.createGroup(
				request.user?.userId!,
				request.body,
			);
			return response.status(httpStatus.CREATED).send(newGroup);
		} catch (error: any) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(
						httpStatus.INTERNAL_SERVER_ERROR,
						"An error occurred while creating group.",
					),
				);
			}
		}
	};

	private getGroup = async (request: Request, response: Response, nextFunction: NextFunction) => {
		try {
			const group = await this.groupService.getGroup(request.params.slug);
			return response.status(httpStatus.OK).send(group);
		} catch (error: any) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(
						httpStatus.INTERNAL_SERVER_ERROR,
						"An unexpected error occurred.",
					),
				);
			}
		}
	};
}

export default GroupController;

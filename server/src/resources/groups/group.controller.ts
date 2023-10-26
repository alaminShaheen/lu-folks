import Controller from "@/abstracts/controller";
import { inject } from "tsyringe";
import IGroupService from "@/models/interfaces/IGroupService";
import DtoValidator from "@/middlewares/dtoValidator";
import verifyAuthentication from "@/middlewares/verifyAuthentication";
import CreateGroupDto from "@/dtos/createGroup.dto";
import { NextFunction, Request, Response } from "express";
import HttpException from "@/exceptions/httpException";
import httpStatus from "http-status";

class GroupController extends Controller {
	constructor(@inject("IGroupService") private readonly groupService: IGroupService) {
		super("/group");
		this.initialiseRoutes();
	}

	public createGroup = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const newGroup = this.groupService.createGroup(request.user?.userId!, request.body);
			return response.status(httpStatus.CREATED).send(newGroup);
		} catch (error: any) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred."),
				);
			}
		}
	};

	protected initialiseRoutes(): void {
		this.router
			.route(this.path)
			.post(verifyAuthentication, DtoValidator(CreateGroupDto), this.createGroup);
	}
}

export default GroupController;

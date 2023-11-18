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
		this.router
			.route(this.path)
			.post(verifyAuthentication, DtoValidator(CreateGroupDto), this.createGroup);
		this.router
			.route(`${this.path}/suggestions`)
			.get(verifyAuthentication, this.groupSuggestions);
		this.router.route(`${this.path}/:slug`).get(verifyAuthentication, this.getGroupInfo);
		this.router
			.route(`${this.path}/details/:slug`)
			.get(verifyAuthentication, this.getGroupData);
		this.router.route(`${this.path}/join/:slug`).post(verifyAuthentication, this.joinGroup);
		this.router.route(`${this.path}/leave/:slug`).delete(verifyAuthentication, this.leaveGroup);
	};

	private groupSuggestions = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const cursorId = request.query.cursor as string | undefined;
			const groups = await this.groupService.groupSuggestions(
				request.user?.userId!,
				cursorId,
			);
			return response.status(httpStatus.OK).send(groups);
		} catch (error: any) {
			if (error instanceof Error) nextFunction(error);
			else {
				nextFunction(
					new HttpException(
						httpStatus.INTERNAL_SERVER_ERROR,
						"An error occurred while fetching groups.",
					),
				);
			}
		}
	};

	private joinGroup = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			await this.groupService.joinGroup(request.user?.userId!, request.params.slug);
			return response.sendStatus(httpStatus.OK);
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

	private leaveGroup = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			await this.groupService.leaveGroup(request.user?.userId!, request.params.slug);
			return response.sendStatus(httpStatus.OK);
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

	private getGroupData = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const group = await this.groupService.getGroupData(request.params.slug);
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

	private getGroupInfo = async (
		request: Request,
		response: Response,
		nextFunction: NextFunction,
	) => {
		try {
			const group = await this.groupService.getGroupInfo(
				request.params.slug,
				request.user?.userId!,
			);
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

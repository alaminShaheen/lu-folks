import Controller from "@/abstracts/controller";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

class HealthcheckController extends Controller {
	constructor() {
		super("/healthcheck");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = (): void => {
		this.router.get("/", this.healthcheck);
	};

	private healthcheck(request: Request, response: Response, nextFunction: NextFunction) {
		return response.sendStatus(httpStatus.OK);
	}
}

export default HealthcheckController;
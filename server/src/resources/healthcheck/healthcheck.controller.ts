import Controller from "@/abstracts/controller";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { injectable } from "tsyringe";
import PostgresDatabase from "@/database/postgres.database";

@injectable()
class HealthcheckController extends Controller {
	constructor(private readonly databaseInstance: PostgresDatabase) {
		super("/healthcheck");
		this.initialiseRoutes();
	}

	protected initialiseRoutes = (): void => {
		this.router.route(this.path).get(this.healthcheck);
		// TODO: Need to remove this later
		// this.router.route(`${this.path}/test`).get(this.test);
	};

	private healthcheck(request: Request, response: Response, nextFunction: NextFunction) {
		return response.sendStatus(httpStatus.OK);
	}

	// TODO: Need to remove this later
	// private test = async (request: Request, response: Response, nextFunction: NextFunction) => {
	// 	const post1 = this.databaseInstance.postRepository?.create({
	// 		title: "hello",
	// 		content: { body: "Good stuff" },
	// 	});
	// 	const user1 = this.databaseInstance.userRepository?.create({
	// 		username: "sakib",
	// 		email: "alamin1@gmail.com",
	// 		password: "sakib",
	// 		posts: [],
	// 	});
	//
	// 	if (user1 && post1) {
	// 		user1.posts.push(post1);
	// 		await this.databaseInstance.userRepository?.save(user1);
	// 	}
	// 	return response.sendStatus(httpStatus.OK);
	// };
}

export default HealthcheckController;

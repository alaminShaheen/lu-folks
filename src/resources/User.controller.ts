import httpStatus from 'http-status';
import Controller from '../abstracts/Controller';
import { NextFunction, Request, Response } from 'express';

class UserController extends Controller {

	constructor(protected readonly path: string) {
		super(path);
		this.initialiseRoutes();
	}

	protected initialiseRoutes() {
		this.router.get(this.path, this.getUsers);
	}

	private getUsers(
		__: Request,
		response: Response,
		_: NextFunction
	) {
		response.status(httpStatus.OK).send({ user: 'Hello', id: 'World' });
	}
}

export default UserController;
import httpStatus from 'http-status';
import Controller from '../abstracts/controller';
import { NextFunction, Request, Response } from 'express';
import CreateUserDto from '../dtos/create-user.dto';
import DtoValidator from '../middlewares/dtoValidator';

class UserController extends Controller {
	constructor(protected readonly path: string) {
		super(path);
		this.initialiseRoutes();
	}

	protected initialiseRoutes() {
		this.router.get(this.path, this.getUsers);
		this.router.post(
			this.path,
			DtoValidator(CreateUserDto),
			this.createUser,
		);
	}

	private getUsers(__: Request, response: Response, _: NextFunction) {
		response.status(httpStatus.OK).send({ user: 'Hello', id: 'World' });
	}

	private createUser(request: Request, response: Response, _: NextFunction) {
		console.log(request.body);
		return response.status(httpStatus.OK).send(request.body);
	}
}

export default UserController;

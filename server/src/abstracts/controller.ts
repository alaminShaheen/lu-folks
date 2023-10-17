import { Router } from "express";

abstract class Controller {
	public router: Router = Router();

	protected constructor(protected readonly path: string) {}

	protected abstract initialiseRoutes(): void;
}

export default Controller;

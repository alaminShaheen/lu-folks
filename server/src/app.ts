import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import errorHandler from "./middlewares/errorHandler";
import Controller from "./abstracts/controller";
import cookieParser from "cookie-parser";
import process from "process";
import httpStatus from "http-status";

class App {
	public expressInstance: Application;

	constructor(
		controllers: Controller[],
		public port: number,
	) {
		this.expressInstance = express();
		this.initialiseMiddlewares();
		this.initialiseControllers(controllers);
		this.initialiseErrorHandling();
	}

	public listen() {
		this.expressInstance.listen(this.port, () => {
			console.log(`App listening to port: ${this.port}`);
		});
	}

	private initialiseMiddlewares() {
		this.expressInstance.use(helmet());
		this.expressInstance.use(
			cors({
				origin: process.env.CLIENT_ORIGIN_URL,
				credentials: true,
				optionsSuccessStatus: httpStatus.OK,
			}),
		);
		this.expressInstance.use(morgan("dev"));
		this.expressInstance.use(express.json());
		this.expressInstance.use(express.urlencoded({ extended: false }));
		this.expressInstance.use(compression());
		this.expressInstance.use(cookieParser());
	}

	private initialiseErrorHandling() {
		this.expressInstance.use(errorHandler);
	}

	private initialiseControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.expressInstance.use("/api", controller.router);
		});
	}
}

export default App;

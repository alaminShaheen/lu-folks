import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import errorHandler from './middlewares/errorHandler';
import Controller from './abstracts/controller';
import process from 'process';
import * as mongoose from 'mongoose';

class App {
	public expressInstance: Application;

	constructor(controllers: Controller[], public port: number) {
		this.expressInstance = express();
		void this.initialiseDatabase();
		this.initialiseMiddlewares();
		this.initialiseControllers(controllers);
		this.initialiseErrorHandling();
	}

	public listen() {
		this.expressInstance.listen(this.port, () => {
			console.log(`App listening to port: ${this.port}`);
		});
	}

	private async initialiseDatabase() {
		const { MONGO_URL } = process.env;

		if (!MONGO_URL) {
			throw new Error('Invalid database URL');
		}

		try {
			await mongoose.connect(MONGO_URL);
		} catch (error) {
			console.error('Could not establish connection with server');
		}
	}

	private initialiseMiddlewares() {
		this.expressInstance.use(helmet());
		this.expressInstance.use(cors());
		this.expressInstance.use(morgan('dev'));
		this.expressInstance.use(express.json());
		this.expressInstance.use(express.urlencoded({ extended: false }));
		this.expressInstance.use(compression());
	}

	private initialiseErrorHandling() {
		this.expressInstance.use(errorHandler);
	}

	private initialiseControllers(controllers: Controller[]) {
		controllers.forEach(controller => {
			this.expressInstance.use('/api', controller.router);
		});
	}
}

export default App;
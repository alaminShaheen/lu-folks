import Database from "@/abstracts/database";
import { DataSource, Repository } from "typeorm";
import UserEntity from "./entities/user.entity";
import process from "process";
import HttpException from "@/exceptions/httpException";
import httpStatus from "http-status";
import { Lifecycle, scoped } from "tsyringe";

@scoped(Lifecycle.ContainerScoped)
class PostgresDatabase extends Database {
	constructor() {
		super();
		void this.connect();
	}

	get getUserRepository(): Repository<UserEntity> | null {
		if (this.dataSource) {
			return this.dataSource.getRepository<UserEntity>(UserEntity);
		}
		return null;
	}

	connect = async (): Promise<void> => {
		try {
			this.dataSource = new DataSource({
				applicationName: "lu_folks_dev",
				type: "postgres",
				host: "localhost",
				port: Number(process.env.POSTGRES_DATABASE_PORT),
				username: process.env.POSTGRES_USER,
				password: process.env.POSTGRES_PASSWORD,
				synchronize: true,
				logging: false,
				database: "postgres",
				entities: ["dist/database/entities/*.entity.js"],
			});
			await this.dataSource.initialize();
			console.log("Database connected successfully.");
		} catch (error) {
			console.log(error);
			throw new HttpException(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Database connection could not be established successfully",
			);
		}
	};

	disconnect = async () => {
		if (this.dataSource) {
			try {
				await this.dataSource.destroy();
			} catch (error) {
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"An error occurred while disconnecting your database",
				);
			}
		}
	};
}

export default PostgresDatabase;

import httpStatus from "http-status";
import { Lifecycle, scoped } from "tsyringe";
import { DataSource, Repository } from "typeorm";
import Database from "@/abstracts/database";
import UserEntity from "@/database/entities/user.entity";
import PostEntity from "@/database/entities/post.entity";
import HttpException from "@/exceptions/httpException";
import SessionEntity from "@/database/entities/session.entity";
import { dataSourceOptions } from "@/database/typeorm.config";
import GroupEntity from "@/database/entities/group.entity";

@scoped(Lifecycle.ContainerScoped)
class PostgresDatabase extends Database {
	constructor() {
		super();
		void this.connect();
	}

	get userRepository(): Repository<UserEntity> | null {
		if (this.dataSource) {
			return this.dataSource.getRepository<UserEntity>(UserEntity);
		}
		return null;
	}

	get sessionRepository(): Repository<SessionEntity> | null {
		if (this.dataSource) {
			return this.dataSource.getRepository<SessionEntity>(SessionEntity);
		}
		return null;
	}

	get postRepository(): Repository<PostEntity> | null {
		if (this.dataSource) {
			return this.dataSource.getRepository<PostEntity>(PostEntity);
		}
		return null;
	}

	get groupRepository(): Repository<GroupEntity> | null {
		if (this.dataSource) {
			return this.dataSource.getRepository<GroupEntity>(GroupEntity);
		}
		return null;
	}

	connect = async (): Promise<void> => {
		try {
			this.dataSource = new DataSource(dataSourceOptions);
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

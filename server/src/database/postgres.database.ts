import httpStatus from "http-status";
import { Lifecycle, scoped } from "tsyringe";
import Database from "@/abstracts/database";
import HttpException from "@/exceptions/httpException";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

class UserDeletgate {}

@scoped(Lifecycle.ContainerScoped)
class PostgresDatabase extends Database {
	constructor() {
		super();
		this.dataSource = new PrismaClient();
	}

	public get userRepository(): Prisma.UserDelegate<DefaultArgs> {
		return this.dataSource.user;
	}

	public get sessionRepository(): Prisma.SessionDelegate<DefaultArgs> {
		return this.dataSource.session;
	}

	public get postRepository(): Prisma.PostDelegate<DefaultArgs> {
		return this.dataSource.post;
	}

	public get groupRepository(): Prisma.GroupDelegate<DefaultArgs> {
		return this.dataSource.group;
	}

	disconnect = async () => {
		if (this.dataSource) {
			try {
				await this.dataSource.$disconnect();
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

import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

abstract class Database {
	protected dataSource: PrismaClient;

	public abstract get userRepository(): Prisma.UserDelegate<DefaultArgs>;

	public abstract get sessionRepository(): Prisma.SessionDelegate<DefaultArgs>;

	public abstract get postRepository(): Prisma.PostDelegate<DefaultArgs>;

	public abstract get groupRepository(): Prisma.GroupDelegate<DefaultArgs>;

	abstract disconnect(): void;
}

export default Database;

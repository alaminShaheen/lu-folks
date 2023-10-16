import { DataSource, Repository } from "typeorm";
import UserEntity from "../database/entities/user.entity";
import SessionEntity from "@/database/entities/session.entity";

abstract class Database {
	protected dataSource: DataSource | null = null;

	abstract get userRepository(): Repository<UserEntity> | null;

	abstract get sessionRepository(): Repository<SessionEntity> | null;

	abstract connect(): void;

	abstract disconnect(): void;
}

export default Database;

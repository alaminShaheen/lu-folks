import { DataSource, Repository } from "typeorm";
import UserEntity from "../database/entities/user.entity";

abstract class Database {
	protected dataSource: DataSource | null = null;

	abstract get getUserRepository(): Repository<UserEntity> | null;

	abstract connect(): void;

	abstract disconnect(): void;
}

export default Database;

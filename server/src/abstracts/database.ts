import { DataSource, Repository } from "typeorm";
import UserEntity from "../database/entities/user.entity";
import SessionEntity from "@/database/entities/session.entity";
import PostEntity from "@/database/entities/post.entity";

abstract class Database {
	protected dataSource: DataSource | null = null;

	abstract get userRepository(): Repository<UserEntity> | null;

	abstract get sessionRepository(): Repository<SessionEntity> | null;

	abstract get postRepository(): Repository<PostEntity> | null;

	abstract connect(): void;

	abstract disconnect(): void;
}

export default Database;

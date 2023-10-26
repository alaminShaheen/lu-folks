import UserEntity from "@/database/entities/user.entity";

interface IUserService {
	getUsers(): Promise<unknown>;

	saveUser(user: UserEntity): Promise<UserEntity>;

	getUserById(userId: string): Promise<UserEntity | null>;

	createAndSaveUser(userInfo: Partial<UserEntity>): Promise<Partial<UserEntity>>;
}

export default IUserService;

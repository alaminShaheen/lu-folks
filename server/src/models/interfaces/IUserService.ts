import UserEntity from "@/database/entities/user.entity";

interface IUserService {
	getUsers(): Promise<unknown>;

	getCurrentUser(userId: string): Promise<Pick<UserEntity, "imageUrl" | "username" | "email">>;

	saveUser(user: UserEntity): Promise<UserEntity>;

	getUserById(userId: string): Promise<UserEntity | null>;

	createAndSaveUser(userInfo: Partial<UserEntity>): Promise<Partial<UserEntity>>;
}

export default IUserService;

import UserEntity from "@/database/entities/user.entity";

interface IUserService {
	getUsers(): Promise<unknown>;

	createUser(userInfo: Partial<UserEntity>): Promise<Partial<UserEntity>>;
}

export default IUserService;

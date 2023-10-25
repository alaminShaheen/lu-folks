import UserEntity from "@/database/entities/user.entity";

interface IUserService {
	getUsers(): Promise<unknown>;

	createAndSaveUser(userInfo: Partial<UserEntity>): Promise<Partial<UserEntity>>;
}

export default IUserService;

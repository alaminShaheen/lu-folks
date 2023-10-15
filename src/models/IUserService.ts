import CreateUserDto from "@/dtos/create-user.dto";

interface IUserService {
	getUsers(): Promise<unknown>;

	createUser(newUserInfo: CreateUserDto): Promise<unknown>;
}

export default IUserService;

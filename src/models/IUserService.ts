import RegisterUserDto from "@/dtos/registerUser.dto";

interface IUserService {
	getUsers(): Promise<unknown>;

	createUser(newUserInfo: RegisterUserDto): Promise<unknown>;
}

export default IUserService;

import httpStatus from "http-status";
import { injectable } from "tsyringe";
import IUserService from "@/models/IUserService";
import HttpException from "@/exceptions/httpException";
import RegisterUserDto from "@/dtos/registerUser.dto";
import PostgresDatabase from "@/database/postgres.database";

@injectable()
class UserService implements IUserService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	public getUsers = async () => {
		try {
			const users = await this.databaseInstance.userRepository?.find();
			if (!users) throw new HttpException(httpStatus.NO_CONTENT, "No users found");
			return users;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public createUser = async (newUserInfo: RegisterUserDto) => {
		try {
			const user = this.databaseInstance.userRepository?.create({
				email: newUserInfo.email,
			});

			if (!user)
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"User could not be created",
				);
			this.databaseInstance.userRepository?.save(user);
			return user;
		} catch (error) {
			throw error;
		}
	};
}

export default UserService;

import httpStatus from "http-status";
import { injectable } from "tsyringe";
import IUserService from "@/models/interfaces/IUserService";
import HttpException from "@/exceptions/httpException";
import PostgresDatabase from "@/database/postgres.database";
import UserEntity from "@/database/entities/user.entity";

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

	public createAndSaveUser = async (newUserInfo: Partial<UserEntity>): Promise<UserEntity> => {
		try {
			const user = this.databaseInstance.userRepository?.create(newUserInfo);

			if (!user) {
				console.log("User could not be created.");
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"An internal server error occurred.",
				);
			}
			const newUser = await this.databaseInstance.userRepository?.save(user);

			if (!newUser) {
				console.log("User could not be saved to database.");
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"An internal server error occurred.",
				);
			}
			return newUser;
		} catch (error) {
			throw error;
		}
	};
}

export default UserService;

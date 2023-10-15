import httpStatus from "http-status";
import { injectable, singleton } from "tsyringe";
import IUserService from "@/models/IUserService";
import HttpException from "@/exceptions/httpException";
import CreateUserDto from "@/dtos/create-user.dto";
import PostgresDatabase from "@/database/postgres.database";

@singleton()
@injectable()
class UserService implements IUserService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	public getUsers = async () => {
		try {
			const users = await this.databaseInstance.getUserRepository?.find({});
			if (!users) throw new HttpException(httpStatus.NO_CONTENT, "No users found");
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public createUser = async (newUserInfo: CreateUserDto) => {
		try {
			const user = this.databaseInstance.getUserRepository?.create({
				email: newUserInfo.email,
				firstname: newUserInfo.name,
			});

			if (!user)
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"User could not be created",
				);
			this.databaseInstance.getUserRepository?.save(user);
			return user;
		} catch (error) {
			throw error;
		}
	};
}

export default UserService;

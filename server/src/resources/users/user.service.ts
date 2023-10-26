import httpStatus from "http-status";
import { injectable } from "tsyringe";
import IUserService from "@/models/interfaces/IUserService";
import HttpException from "@/exceptions/httpException";
import PostgresDatabase from "@/database/postgres.database";
import UserEntity from "@/database/entities/user.entity";
import { Repository } from "typeorm";
import * as console from "console";

@injectable()
class UserService implements IUserService {
	private readonly userRepository: Repository<UserEntity>;

	constructor(private readonly databaseInstance: PostgresDatabase) {
		this.userRepository = this.databaseInstance.userRepository!;
	}

	public getUserById = async (userId: string): Promise<UserEntity | null> => {
		try {
			const user = await this.userRepository.findOneBy({ id: userId });
			if (!user) {
				console.log(`User with id: ${userId} not found.`);
				return null;
			}
			return user;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public getUsers = async () => {
		try {
			const users = await this.userRepository.find();
			if (!users) throw new HttpException(httpStatus.NO_CONTENT, "No users found");
			return users;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public saveUser = async (user: UserEntity): Promise<UserEntity> => {
		try {
			return await this.userRepository.save(user);
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public createAndSaveUser = async (newUserInfo: Partial<UserEntity>): Promise<UserEntity> => {
		try {
			const user = this.userRepository.create(newUserInfo);

			if (!user) {
				console.log("User could not be created.");
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"An internal server error occurred.",
				);
			}
			const newUser = await this.userRepository.save(user);

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

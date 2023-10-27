import httpStatus from "http-status";
import { injectable } from "tsyringe";
import IUserService from "@/models/interfaces/IUserService";
import HttpException from "@/exceptions/httpException";
import PostgresDatabase from "@/database/postgres.database";
import * as console from "console";
import { User } from "@prisma/client";
import UserCreate from "@/models/types/UserCreate";
import AuthenticatedUser from "@/models/types/AuthenticatedUser";

@injectable()
class UserService implements IUserService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	public getCurrentUser = async (userId: string): Promise<AuthenticatedUser> => {
		try {
			const currentUser = await this.databaseInstance.userRepository.findFirst({
				where: { id: userId },
			});
			if (!currentUser) {
				console.log("Could not find current user.");
				throw new HttpException(httpStatus.UNAUTHORIZED, "User is not authenticated.");
			}
			return {
				username: currentUser.username,
				imageUrl: currentUser.imageUrl || null,
				email: currentUser.email,
				id: currentUser.id,
			};
		} catch (error: any) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public getUserById = async (userId: string): Promise<User | null> => {
		try {
			const user: User | null = await this.databaseInstance.userRepository.findFirst({
				where: { id: userId },
			});
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

	public getUsers = async (): Promise<User[]> => {
		try {
			const users = await this.databaseInstance.userRepository.findMany({ take: 5 });
			if (!users) throw new HttpException(httpStatus.NO_CONTENT, "No users found");
			return users;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else throw new HttpException(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred");
		}
	};

	public createAndSaveUser = async (newUserInfo: UserCreate): Promise<User> => {
		try {
			const user = this.databaseInstance.userRepository.create({ data: newUserInfo });

			if (!user) {
				console.log("User could not be created.");
				throw new HttpException(
					httpStatus.INTERNAL_SERVER_ERROR,
					"An internal server error occurred.",
				);
			}
			return user;
		} catch (error) {
			throw error;
		}
	};
}

export default UserService;

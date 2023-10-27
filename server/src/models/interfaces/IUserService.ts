import { User } from "@prisma/client";
import UserCreate from "@/models/types/UserCreate";

interface IUserService {
	getUsers(): Promise<User[]>;

	getCurrentUser(userId: string): Promise<Pick<User, "imageUrl" | "username" | "email">>;

	// updateUser(userId: string): Promise<Pick<User, "imageUrl" | "username" | "email">>;

	getUserById(userId: string): Promise<User | null>;

	createAndSaveUser(userInfo: UserCreate): Promise<User>;
}

export default IUserService;

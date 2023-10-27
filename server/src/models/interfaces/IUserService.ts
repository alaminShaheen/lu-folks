import { User } from "@prisma/client";
import UserCreate from "@/models/types/UserCreate";
import AuthenticatedUser from "@/models/types/AuthenticatedUser";

interface IUserService {
	getUsers(): Promise<User[]>;

	getCurrentUser(userId: string): Promise<AuthenticatedUser>;

	// updateUser(userId: string): Promise<Pick<User, "imageUrl" | "username" | "email">>;

	getUserById(userId: string): Promise<User | null>;

	createAndSaveUser(userInfo: UserCreate): Promise<User>;
}

export default IUserService;

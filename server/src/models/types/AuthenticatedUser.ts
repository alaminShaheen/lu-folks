import { User } from "@prisma/client";

type AuthenticatedUser = Pick<User, "imageUrl" | "username" | "email" | "id" | "authProvider">;

export default AuthenticatedUser;

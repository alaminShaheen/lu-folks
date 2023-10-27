import { User } from "@prisma/client";

type AuthenticatedUser = Pick<User, "imageUrl" | "username" | "email" | "id">;

export default AuthenticatedUser;

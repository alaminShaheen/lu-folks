import { Prisma } from "@prisma/client";

type UserCreate =
	| (Prisma.Without<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput> &
			Prisma.UserUncheckedCreateInput)
	| (Prisma.Without<Prisma.UserUncheckedCreateInput, Prisma.UserCreateInput> &
			Prisma.UserCreateInput);

export default UserCreate;

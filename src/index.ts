import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { container } from "tsyringe";
import App from "./app";
import validateEnv from "@/utils/validateEnv";
import UserController from "@/resources/users/user.controller";
import PostgresDatabase from "./database/postgres.database";
import UserService from "@/resources/users/user.service";
import AuthService from "@/resources/auth/auth.service";
import AuthController from "@/resources/auth/auth.controller";

validateEnv();
const database = container.resolve(PostgresDatabase);
const userService = container.resolve(UserService);
const authService = container.resolve(AuthService);

container.register("IUserService", { useClass: UserService });
container.register("IAuthService", { useClass: AuthService });

const userController = container.resolve(UserController);
const authController = container.resolve(AuthController);

const app = new App([userController, authController], Number(process.env.PORT));
app.listen();

import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { container } from "tsyringe";
import App from "./app";
import validateEnv from "@/utils/validateEnv";
import UserController from "@/resources/users/user.controller";
import PostgresDatabase from "./database/postgres.database";
import UserService from "@/resources/users/user.service";

validateEnv();
const database = container.resolve(PostgresDatabase);
const userService = container.resolve(UserService);
container.register("IUserService", { useClass: UserService });
const userController = container.resolve(UserController);

const app = new App([userController], Number(process.env.PORT));
app.listen();

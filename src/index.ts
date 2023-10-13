import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { container } from "tsyringe";
import App from "./app";
import validateEnv from "@/utils/validateEnv";
import UserController from "@/resources/users/user.controller";
import PostgresDatabase from "./database/postgres.database";

validateEnv();
const userController = container.resolve(UserController);
const database = container.resolve(PostgresDatabase);
const app = new App([userController], Number(process.env.PORT));
app.listen();

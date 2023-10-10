import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { container } from "tsyringe";
import App from "./app";
import validateEnv from "@/utils/validateEnv";
import UserController from "@/resources/users/user.controller";

validateEnv();
const userController = container.resolve(UserController);
const app = new App([userController], Number(process.env.PORT));
app.listen();

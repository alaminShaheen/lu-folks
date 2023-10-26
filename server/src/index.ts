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
import PostService from "@/resources/posts/post.service";
import AuthController from "@/resources/auth/auth.controller";
import PostController from "@/resources/posts/post.controller";
import HealthcheckController from "@/resources/healthcheck/healthcheck.controller";

validateEnv();
container.resolve(PostgresDatabase);
container.resolve(UserService);
container.resolve(AuthService);

container.register("IUserService", { useClass: UserService });
container.register("IPostService", { useClass: PostService });
container.register("IAuthService", { useClass: AuthService });

const userController = container.resolve(UserController);
const postController = container.resolve(PostController);
const authController = container.resolve(AuthController);
const healthcheckController = container.resolve(HealthcheckController);

const app = new App(
	[userController, authController, postController, healthcheckController],
	Number(process.env.PORT),
);

app.listen();

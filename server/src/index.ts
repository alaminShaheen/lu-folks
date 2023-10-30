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
import GroupService from "@/resources/groups/group.service";
import GroupController from "@/resources/groups/group.controller";
import process from "process";
import FileController from "@/resources/files/file.controller";

validateEnv();
container.resolve(PostgresDatabase);
container.resolve(UserService);
container.resolve(AuthService);

container.register("IUserService", { useClass: UserService });
container.register("IPostService", { useClass: PostService });
container.register("IAuthService", { useClass: AuthService });
container.register("IGroupService", { useClass: GroupService });

const userController = container.resolve(UserController);
const postController = container.resolve(PostController);
const authController = container.resolve(AuthController);
const groupController = container.resolve(GroupController);
const healthcheckController = container.resolve(HealthcheckController);
const fileController = container.resolve(FileController);

const app = new App(
	[
		userController,
		authController,
		postController,
		healthcheckController,
		groupController,
		fileController,
	],
	Number(process.env.PORT),
);

app.listen();

import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import process from "process";
import { container } from "tsyringe";
import App from "./app";
import validateEnv from "@/utils/validateEnv";
import AuthService from "@/resources/auth/auth.service";
import UserService from "@/resources/users/user.service";
import PostService from "@/resources/posts/post.service";
import GroupService from "@/resources/groups/group.service";
import RedisDatabase from "@/database/redis.database";
import AuthController from "@/resources/auth/auth.controller";
import UserController from "@/resources/users/user.controller";
import PostController from "@/resources/posts/post.controller";
import FileController from "@/resources/files/file.controller";
import GroupController from "@/resources/groups/group.controller";
import PostgresDatabase from "@/database/postgres.database";
import PostReactionService from "@/resources/postReactions/postReaction.service";
import HealthcheckController from "@/resources/healthcheck/healthcheck.controller";
import PostReactionController from "@/resources/postReactions/postReaction.controller";
import CommentController from "@/resources/comments/comment.controller";
import CommentService from "@/resources/comments/comment.service";

validateEnv();
container.resolve(PostService);
container.resolve(UserService);
container.resolve(AuthService);
container.resolve(RedisDatabase);
container.resolve(CommentService);
container.resolve(PostgresDatabase);
container.resolve(PostReactionService);

container.register("IUserService", { useClass: UserService });
container.register("IPostService", { useClass: PostService });
container.register("IAuthService", { useClass: AuthService });
container.register("IGroupService", { useClass: GroupService });
container.register("ICommentService", { useClass: CommentService });
container.register("IPostReactionService", { useClass: PostReactionService });

const fileController = container.resolve(FileController);
const userController = container.resolve(UserController);
const postController = container.resolve(PostController);
const authController = container.resolve(AuthController);
const groupController = container.resolve(GroupController);
const commentController = container.resolve(CommentController);
const healthcheckController = container.resolve(HealthcheckController);
const postReactionController = container.resolve(PostReactionController);

const app = new App(
	[
		userController,
		authController,
		postController,
		postController,
		fileController,
		groupController,
		commentController,
		healthcheckController,
		postReactionController,
	],
	Number(process.env.PORT),
);

app.listen();

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
import SearchService from "@/resources/search/search.service";
import AuthController from "@/resources/auth/auth.controller";
import UserController from "@/resources/users/user.controller";
import PostController from "@/resources/posts/post.controller";
import FileController from "@/resources/files/file.controller";
import CommentService from "@/resources/comments/comment.service";
import GroupController from "@/resources/groups/group.controller";
import PostgresDatabase from "@/database/postgres.database";
import SearchController from "@/resources/search/search.controller";
import CommentController from "@/resources/comments/comment.controller";
import PostReactionService from "@/resources/postReactions/postReaction.service";
import HealthcheckController from "@/resources/healthcheck/healthcheck.controller";
import PostReactionController from "@/resources/postReactions/postReaction.controller";
import CommentReactionService from "@/resources/commentReactions/commentReaction.service";
import CommentReactionController from "@/resources/commentReactions/commentReaction.controller";

validateEnv();
container.resolve(PostService);
container.resolve(UserService);
container.resolve(AuthService);
container.resolve(SearchService);
container.resolve(RedisDatabase);
container.resolve(CommentService);
container.resolve(PostgresDatabase);
container.resolve(PostReactionService);
container.resolve(CommentReactionService);

container.register("IUserService", { useClass: UserService });
container.register("IPostService", { useClass: PostService });
container.register("IAuthService", { useClass: AuthService });
container.register("IGroupService", { useClass: GroupService });
container.register("ISearchService", { useClass: SearchService });
container.register("ICommentService", { useClass: CommentService });
container.register("IPostReactionService", { useClass: PostReactionService });
container.register("ICommentReactionService", { useClass: CommentReactionService });

const fileController = container.resolve(FileController);
const userController = container.resolve(UserController);
const postController = container.resolve(PostController);
const authController = container.resolve(AuthController);
const groupController = container.resolve(GroupController);
const searchController = container.resolve(SearchController);
const commentController = container.resolve(CommentController);
const healthcheckController = container.resolve(HealthcheckController);
const postReactionController = container.resolve(PostReactionController);
const commentReactionController = container.resolve(CommentReactionController);

const app = new App(
	[
		userController,
		authController,
		postController,
		postController,
		fileController,
		groupController,
		searchController,
		commentController,
		healthcheckController,
		postReactionController,
		commentReactionController,
	],
	Number(process.env.PORT),
);

app.listen();

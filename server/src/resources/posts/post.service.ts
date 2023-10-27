import PostgresDatabase from "@/database/postgres.database";
import { injectable } from "tsyringe";
import IPostService from "@/models/interfaces/IPostService";
import { Post } from "@prisma/client";

@injectable()
class PostService implements IPostService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	createPost(): Promise<void> {
		return Promise.resolve(undefined);
	}

	deletePost(postId: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	getUserPosts(userId: string): Promise<Post[]> {
		return Promise.resolve([]);
	}

	updatePost(postInfo: Partial<Post>): Promise<void> {
		return Promise.resolve(undefined);
	}
}

export default PostService;

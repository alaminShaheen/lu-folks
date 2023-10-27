import PostgresDatabase from "@/database/postgres.database";
import { injectable } from "tsyringe";
import PostEntity from "@/database/entities/post.entity";
import IPostService from "@/models/interfaces/IPostService";

@injectable()
class PostService implements IPostService {
	constructor(private readonly databaseInstance: PostgresDatabase) {}

	createPost(): Promise<void> {
		return Promise.resolve(undefined);
	}

	deletePost(postId: string): Promise<void> {
		return Promise.resolve(undefined);
	}

	getUserPosts(userId: string): Promise<PostEntity[]> {
		return Promise.resolve([]);
	}

	updatePost(postInfo: Partial<PostEntity>): Promise<void> {
		return Promise.resolve(undefined);
	}
}

export default PostService;

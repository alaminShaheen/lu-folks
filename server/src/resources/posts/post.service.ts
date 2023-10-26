import PostgresDatabase from "@/database/postgres.database";
import { injectable } from "tsyringe";
import { Repository } from "typeorm";
import PostEntity from "@/database/entities/post.entity";
import IPostService from "@/models/interfaces/IPostService";

@injectable()
class PostService implements IPostService {
	private readonly postRepository: Repository<PostEntity>;

	constructor(private readonly databaseInstance: PostgresDatabase) {
		this.postRepository = this.databaseInstance.postRepository!;
	}

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

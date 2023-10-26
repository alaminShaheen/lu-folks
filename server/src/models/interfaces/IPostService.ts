import PostEntity from "@/database/entities/post.entity";

interface IPostService {
	getUserPosts: (userId: string) => Promise<PostEntity[]>;
	createPost: () => Promise<void>;
	updatePost: (postInfo: Partial<PostEntity>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
}

export default IPostService;

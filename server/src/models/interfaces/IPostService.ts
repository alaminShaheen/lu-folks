import { Post } from "@prisma/client";

interface IPostService {
	getUserPosts: (userId: string) => Promise<Post[]>;
	createPost: () => Promise<void>;
	updatePost: (postInfo: Partial<Post>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
}

export default IPostService;

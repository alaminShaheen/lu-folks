import { Post } from "@prisma/client";
import CreatePostDto from "@/dtos/createPost.dto";

interface IPostService {
	getUserPosts: (
		userId: string,
		limit: number,
		page: number,
		groupSlug?: string,
	) => Promise<Post[]>;
	getPost: (userId: string, postSlug: string) => Promise<Post>;
	getInitialFeedPosts: (userId: string) => Promise<Post[]>;
	createPost: (userId: string, postInfo: CreatePostDto) => Promise<Post>;
	updatePost: (postInfo: Partial<Post>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	unfurlLink: (url: string) => Promise<string>;
}

export default IPostService;

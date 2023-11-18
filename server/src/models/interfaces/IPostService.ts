import { Comment, Post } from "@prisma/client";
import CreatePostDto from "@/dtos/createPost.dto";
import PaginatedResponse from "@/models/PaginatedResponse";

interface IPostService {
	getUserPosts: (
		userId: string,
		cursorId?: string,
		groupSlug?: string,
	) => Promise<PaginatedResponse<Post>>;
	getPostComments: (postId: string) => Promise<Comment[]>;
	getPost: (userId: string, postSlug: string) => Promise<Post>;
	getInitialFeedPosts: (userId: string) => Promise<Post[]>;
	createPost: (userId: string, postInfo: CreatePostDto) => Promise<Post>;
	updatePost: (postInfo: Partial<Post>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	unfurlLink: (url: string) => Promise<string>;
}

export default IPostService;

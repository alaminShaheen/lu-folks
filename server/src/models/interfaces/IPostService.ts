import { Comment, Post } from "@prisma/client";
import CreatePostDto from "@/dtos/createPost.dto";
import PaginatedResponse from "@/models/PaginatedResponse";
import UpdatePostDto from "@/dtos/updatePost.dto";

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
	updatePost: (userId: string, postId: string, postInfo: UpdatePostDto) => Promise<Post>;
	deletePost: (userId: string, postId: string) => Promise<Post>;
	unfurlLink: (url: string) => Promise<string>;
}

export default IPostService;

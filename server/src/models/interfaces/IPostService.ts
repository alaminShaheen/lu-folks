import { Post } from "@prisma/client";
import UnfurledData from "@/models/types/UnfurledData";
import CreatePostDto from "@/dtos/createPost.dto";

interface IPostService {
	getUserPosts: (userId: string) => Promise<Post[]>;
	createPost: (userId: string, postInfo: CreatePostDto) => Promise<Post>;
	updatePost: (postInfo: Partial<Post>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	unfurlLink: (url: string) => Promise<UnfurledData>;
}

export default IPostService;

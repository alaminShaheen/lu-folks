import { Post } from "@prisma/client";
import UnfurledData from "@/models/types/UnfurledData";
import CreatePostDto from "@/dtos/createPost.dto";
import PostReactionDto from "@/dtos/postReaction.dto";

interface IPostService {
	getUserPosts: (
		userId: string,
		limit: number,
		page: number,
		groupSlug?: string,
	) => Promise<Post[]>;
	createPost: (userId: string, postInfo: CreatePostDto) => Promise<Post>;
	updatePost: (postInfo: Partial<Post>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	unfurlLink: (url: string) => Promise<UnfurledData>;
	react: (userId: string, postReactionInfo: PostReactionDto) => Promise<void>;
}

export default IPostService;

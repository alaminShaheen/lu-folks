import { Post } from "@prisma/client";
import UnfurledData from "@/models/types/UnfurledData";

interface IPostService {
	getUserPosts: (userId: string) => Promise<Post[]>;
	createPost: () => Promise<void>;
	updatePost: (postInfo: Partial<Post>) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	unfurlLink: (url: string) => Promise<UnfurledData>;
}

export default IPostService;

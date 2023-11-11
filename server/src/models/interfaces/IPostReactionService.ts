import PostReactionDto from "@/dtos/postReaction.dto";
import { User } from "@prisma/client";

interface IPostReactionService {
	react: (userId: string, postReactionInfo: PostReactionDto) => Promise<void>;
	getLikeReactors: (postSlug: string) => Promise<User[]>;
	getDislikeReactors: (postSlug: string) => Promise<User[]>;
}

export default IPostReactionService;

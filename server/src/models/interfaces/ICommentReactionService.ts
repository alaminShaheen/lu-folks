import { User } from "@prisma/client";
import CommentReactionDto from "@/dtos/commentReaction.dto";

interface ICommentReactionService {
	react: (userId: string, commentReactionInfo: CommentReactionDto) => Promise<void>;
	getLikeReactors: (commentSlug: string) => Promise<User[]>;
	getDislikeReactors: (commentSlug: string) => Promise<User[]>;
}

export default ICommentReactionService;

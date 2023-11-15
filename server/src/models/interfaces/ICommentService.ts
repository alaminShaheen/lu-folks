import { Comment } from "@prisma/client";
import CreateCommentDto from "@/dtos/createComment.dto";
import UpdateCommentDto from "@/dtos/updateComment.dto";

export default interface ICommentService {
	createComment: (commentInfo: CreateCommentDto, userId: string) => Promise<Comment>;
	getCommentReplies: (commentId: string) => Promise<Comment[]>;
	updateComment: (commentInfo: UpdateCommentDto) => Promise<Comment>;
	deleteComment: (commentId: string) => Promise<void>;
}

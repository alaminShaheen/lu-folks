import CommentReaction from "@/models/CommentReaction.ts";
import ReplyComment from "@/models/ReplyComment.ts";
import User from "@/models/User.ts";

class Comment {
	static EMPTY = new Comment("", "", "", "", "", User.EMPTY, "", [], [], "");

	constructor(
		public id: string,
		public comment: string,
		public createdAt: string,
		public updatedAt: string,
		public commenterId: string,
		public commenter: User,
		public postId: string,
		public commentReactions: CommentReaction[],
		public replies: ReplyComment[],
		public replyToCommentId?: string,
	) {}
}

export default Comment;

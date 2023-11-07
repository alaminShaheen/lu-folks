import CommentReaction from "@/models/CommentReaction.ts";

class Comment {
	static EMPTY = new Comment("", "", "", "", "", "", []);

	constructor(
		public id: string,
		public comment: string,
		public createdAt: string,
		public updatedAt: string,
		public commenterId: string,
		public postId: string,
		public commentReactions: CommentReaction[],
	) {}
}

export default Comment;

import ReactionType from "@/models/enums/ReactionType.ts";

class CommentReaction {
	static EMPTY = new CommentReaction("", "", ReactionType.LIKE);

	constructor(
		public userId: string,
		public commentId: string,
		public type: ReactionType,
	) {}
}

export default CommentReaction;

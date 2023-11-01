import ReactionType from "@/models/enums/ReactionType.ts";

class PostReaction {
	static EMPTY = new PostReaction("", "", ReactionType.LIKE);

	constructor(
		public userId: string,
		public postId: string,
		public type: ReactionType,
	) {}
}

export default PostReaction;

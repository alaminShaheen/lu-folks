import ReactionType from "@/models/enums/ReactionType.ts";
import User from "@/models/User.ts";

class ReplyComment {
	constructor(
		public comment: string,
		public commentReactions: ReactionType[],
		public commenter: User,
		public replyToCommentId: string,
	) {}
}

export default ReplyComment;

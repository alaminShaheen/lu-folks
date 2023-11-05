import User from "@/models/User.ts";
import Group from "@/models/Group.ts";
import Comment from "@/models/Comment.ts";
import PostReaction from "@/models/PostReaction.ts";

class ExtendedPost {
	static EMPTY = new ExtendedPost(
		"",
		"",
		"",
		new Date(),
		new Date(),
		User.EMPTY,
		Group.EMPTY,
		[],
		[],
	);

	constructor(
		public id: string,
		public title: string,
		public content: any,
		public createdAt: string,
		public updatedAt: string,
		public creator: User,
		public group: Group,
		public comments: Comment[],
		public postReactions: PostReaction[],
	) {}
}

export default ExtendedPost;

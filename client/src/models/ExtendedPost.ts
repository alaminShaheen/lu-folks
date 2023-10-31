import User from "@/models/User.ts";
import Group from "@/models/Group.ts";

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
		public createdAt: Date,
		public updatedAt: Date,
		public creator: User,
		public group: Group,
		public comments: string[],
		public postReactors: string[],
	) {}
}

export default ExtendedPost;

import User from "@/models/User.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";

class ExtendedGroup {
	static EMPTY = new ExtendedGroup("", "", new Date(), new Date(), [], User.EMPTY);

	constructor(
		public id: string,
		public title: string,
		public createdAt: Date,
		public updatedAt: Date,
		public posts: ExtendedPost[],
		public creator: User,
	) {}
}

export default ExtendedGroup;

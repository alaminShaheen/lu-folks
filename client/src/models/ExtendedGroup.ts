import User from "@/models/User.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";

class ExtendedGroup {
	static EMPTY = new ExtendedGroup("", "", "", "", [], User.EMPTY);

	constructor(
		public id: string,
		public title: string,
		public createdAt: string,
		public updatedAt: string,
		public posts: ExtendedPost[],
		public creator: User,
	) {}
}

export default ExtendedGroup;

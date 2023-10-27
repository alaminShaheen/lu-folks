import User from "@/models/User.ts";

class Group {
	static EMPTY = new Group("", "", new Date(), new Date(), [], User.EMPTY);

	constructor(
		public id: string,
		public title: string,
		public createdAt: Date,
		public updatedAt: Date,
		public posts: { title: string }[],
		public creator: User,
	) {}
}

export default Group;

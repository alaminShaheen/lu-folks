class Group {
	static EMPTY = new Group("", "", new Date(), new Date(), []);

	constructor(
		public id: string,
		public title: string,
		public createdAt: Date,
		public updatedAt: Date,
		public posts: { title: string }[],
	) {}
}

export default Group;

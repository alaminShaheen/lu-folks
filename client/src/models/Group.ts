class Group {
	static EMPTY = new Group("", "", new Date(), new Date());

	constructor(
		public id: string,
		public title: string,
		public updatedAt: Date,
		public createdAt: Date,
	) {}
}

export default Group;

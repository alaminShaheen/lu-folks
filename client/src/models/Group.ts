class Group {
	static EMPTY = new Group("", "", "", "");

	constructor(
		public id: string,
		public title: string,
		public updatedAt: string,
		public createdAt: string,
	) {}
}

export default Group;

class Comment {
	static EMPTY = new Comment("", "", new Date(), new Date(), "", "", []);

	constructor(
		public id: string,
		public comment: string,
		public createdAt: Date,
		public updatedAt: Date,
		public commenterId: string,
		public postId: string,
		public commentReactions: string[],
	) {}
}

export default Comment;

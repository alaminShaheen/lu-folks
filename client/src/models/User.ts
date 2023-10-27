class User {
	static EMPTY = new User("", "", "", "");

	constructor(
		public id: string,
		public username: string,
		public email: string,
		public imageUrl?: string,
	) {}
}

export default User;

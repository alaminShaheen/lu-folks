class User {
	static EMPTY = new User("", "", "");

	constructor(
		public username: string,
		public email: string,
		public imageUrl?: string,
	) {}
}

export default User;

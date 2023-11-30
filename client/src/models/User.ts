import AuthProvider from "@/models/AuthProvider.ts";

class User {
	static EMPTY = new User("", "", "", AuthProvider.VANILLA, "");

	constructor(
		public id: string,
		public username: string,
		public email: string,
		public authProvider: AuthProvider,
		public imageUrl?: string,
	) {}
}

export default User;

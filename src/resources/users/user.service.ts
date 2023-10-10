import { singleton } from "tsyringe";

@singleton()
class UserService {
	constructor() {}

	public getUsers() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve([
					{ name: "Sakib", message: "hello World" },
					{ name: "Some random guy", message: "hello Yo!" },
				]);
			}, 1000);
		});
	}
}

export default UserService;

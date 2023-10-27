export const APILinks = {
	login: () => `/auth/login`,
	register: () => `/auth/register`,
	logout: () => `/auth/logout`,
	refreshToken: () => `/auth/refresh-token`,
	currentUser: () => `/user/current-user`,
	createGroup: () => `/group`,
	getGroup: (slug: string) => `/group/${slug}`,
};

export default APILinks;

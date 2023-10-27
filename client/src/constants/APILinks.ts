export const APILinks = {
	login: () => `/auth/login`,
	register: () => `/auth/register`,
	logout: () => `/auth/logout`,
	refreshToken: () => `/auth/refresh-token`,
	currentUser: () => `/user/current-user`,
	createGroup: () => `/group`,
	getGroup: (slug: string) => `/group/${slug}`,
	fetchUserSubscription: (slug: string) => `/group/is-member/${slug}`,
	fetchGroupMemberCount: (slug: string) => `group/member-count/${slug}`,
	joinGroup: (slug: string) => `group/join/${slug}`,
	leaveGroup: (slug: string) => `group/leave/${slug}`,
};

export default APILinks;

export const APILinks = {
	login: () => `/auth/login`,
	register: () => `/auth/register`,
	logout: () => `/auth/logout`,
	refreshToken: () => `/auth/refresh-token`,
	currentUser: () => `/user/current-user`,
	createGroup: () => `/group`,
	getGroupInfo: (slug: string) => `/group/${slug}`,
	getGroupData: (slug: string) => `/group/details/${slug}`,
	fetchUserSubscription: (slug: string) => `/group/is-member/${slug}`,
	fetchGroupMemberCount: (slug: string) => `group/member-count/${slug}`,
	joinGroup: (slug: string) => `group/join/${slug}`,
	leaveGroup: (slug: string) => `group/leave/${slug}`,
	unfurlLink: () => `post/unfurl-link`,
	imageUpload: () => `image-upload`,
	createPost: () => `/post`,
	getPosts: (limit: number, page: number, slug?: string) =>
		`/post?limit=${limit}&page=${page}&slug=${slug}`,
};

export default APILinks;

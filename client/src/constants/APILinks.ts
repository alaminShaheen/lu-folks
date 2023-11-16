export const APILinks = {
	login: () => `/auth/login`,
	register: () => `/auth/register`,
	logout: () => `/auth/logout`,
	refreshToken: () => `/auth/refresh-token`,
	currentUser: () => `/user/current-user`,
	createGroup: () => `/group`,
	getGroupInfo: (slug: string) => `/group/${slug}`,
	getGroupData: (slug: string) => `/group/details/${slug}`,
	joinGroup: (slug: string) => `group/join/${slug}`,
	leaveGroup: (slug: string) => `group/leave/${slug}`,
	unfurlLink: () => `post/unfurl-link`,
	imageUpload: () => `image-upload`,
	createPost: () => `/post`,
	getPosts: (limit: number, page: number, slug?: string) =>
		`/post?limit=${limit}&page=${page}${slug ? `&slug=${slug}` : ""}`,
	reactToPost: () => `/reaction`,
	reactToComment: () => `/comment-reaction`,
	getPostLikeReactors: (postSlug: string) => `/reaction/likes/${postSlug}`,
	getPostDislikeReactors: (postSlug: string) => `/reaction/dislikes/${postSlug}`,
	getInitialFeedPosts: () => `/post/feed`,
	getPost: (slug: string) => `/post/${slug}`,
	createComment: () => `comment`,
	getPostComments: (postId: string) => `post/${postId}/comments`,
	getCommentReplies: (parentCommentId: string) => `/comment/${parentCommentId}/replies`,
	searchGroups: (searchTerm: string) => `/search?searchTerm=${searchTerm}`,
};

export default APILinks;

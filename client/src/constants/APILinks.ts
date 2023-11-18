export const APILinks = {
	login: () => `/auth/login`,
	register: () => `/auth/register`,
	logout: () => `/auth/logout`,
	refreshToken: () => `/auth/refresh-token`,
	currentUser: () => `/user/current-user`,
	createGroup: () => `/group`,
	getGroupInfo: (slug: string) => `/group/${slug}`,
	getGroupData: (slug: string) => `/group/details/${slug}`,
	getSuggestedGroups: (nextCursorId?: string) =>
		`/group/suggestions${nextCursorId ? `?cursor=${nextCursorId}` : ""}`,
	joinGroup: (slug: string) => `group/join/${slug}`,
	leaveGroup: (slug: string) => `group/leave/${slug}`,
	unfurlLink: () => `post/unfurl-link`,
	imageUpload: () => `image-upload`,
	createPost: () => `/post`,
	getPosts: (cursorId?: string, slug?: string) =>
		`/post?${cursorId ? `&cursor=${cursorId}` : ""}${slug ? `&slug=${slug}` : ""}`,
	getPost: (slug: string) => `/post/${slug}`,
	updatePost: (slug: string) => `/post/${slug}`,
	deletePost: (slug: string) => `/post/${slug}`,
	getPostComments: (postId: string) => `post/${postId}/comments`,
	getPostLikeReactors: (postSlug: string) => `/reaction/likes/${postSlug}`,
	getPostDislikeReactors: (postSlug: string) => `/reaction/dislikes/${postSlug}`,
	reactToPost: () => `/reaction`,
	reactToComment: () => `/comment-reaction`,
	createComment: () => `comment`,
	deleteComment: (commentId: string) => `/comment/${commentId}`,
	updateComment: (commentId: string) => `/comment/${commentId}`,
	getCommentReplies: (parentCommentId: string) => `/comment/${parentCommentId}/replies`,
	search: (searchTerm: string) => `/search?searchTerm=${searchTerm}`,
};

export default APILinks;

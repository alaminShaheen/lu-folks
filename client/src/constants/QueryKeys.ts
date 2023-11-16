const QueryKeys = {
	REGISTER: "register",
	LOGIN: "login",
	CURRENT_USER: "current-user",

	GROUP_INFO: "group-info",
	JOIN_GROUP: "join-group",
	LEAVE_GROUP: "leave-group",
	CREATE_GROUP: "create-group",
	GROUP_DETAILS: "group-details",

	GET_POST: "get-post",
	CREATE_POST: "create-post",
	POST_REACTION: "post-reaction",
	INITIAL_FEED_POSTS: "initial-feed-posts",
	FETCH_INFINITE_POST: "fetch-infinite-post",

	CREATE_COMMENT: "create-comment",
	DELETE_COMMENT: "delete-comment",
	UPDATE_COMMENT: "update-comment",
	COMMENT_REACTION: "comment-reaction",
	GET_POST_COMMENTS: "get-post-comments",
	GET_COMMENT_REPLIES: "get-comment-replies",

	SEARCH_GROUPS: "search-groups",
} as const;

export default QueryKeys;

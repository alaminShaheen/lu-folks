const QueryKeys = {
	REGISTER: "register",
	LOGIN: "login",
	CURRENT_USER: "current-user",
	GROUP_DETAILS: "group-details",
	GROUP_INFO: "group-info",
	GROUP_MEMBER_COUNT: "group-member-count",
	IS_GROUP_MEMBER: "is-group-member",
	JOIN_GROUP: "join-group",
	LEAVE_GROUP: "leave-group",
	FETCH_INFINITE_POST: "fetch-infinite-post",
	CREATE_POST: "create-post",
	CREATE_GROUP: "create-group",
	POST_REACTION: "post-reaction",
	COMMENT_REACTION: "comment-reaction",
	INITIAL_FEED_POSTS: "initial-feed-posts",
	GET_POST: "get-post",
	CREATE_COMMENT: "create-comment",
	GET_POST_COMMENTS: "get-post-comments",
	GET_COMMENT_REPLIES: "get-comment-replies",
} as const;

export default QueryKeys;

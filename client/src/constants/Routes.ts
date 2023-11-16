const ROUTES = {
	LOGIN: "/login",
	HOME: "/home",
	REGISTER: "/register",
	CREATE_GROUP: "/create-group",
	GROUP: {
		BASE: "/group/:slug",
		CREATE_POST: "create-post",
		POST_DETAILS: "post/:postSlug",
	},
	USER_PROFILE: "/profile",
};

export default ROUTES;

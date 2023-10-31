const AppConstants = {
	GOOGLE_OAUTH_ROOT_URL: "https://accounts.google.com/o/oauth2/v2/auth",
	GOOGLE_OAUTH_REGISTRATION_REDIRECT_URL: `${
		import.meta.env.VITE_API_BASE_URL
	}/auth/oauth/google/register`,
	GOOGLE_OAUTH_LOGIN_REDIRECT_URL: `${import.meta.env.VITE_API_BASE_URL}/auth/oauth/google/login`,
	INFINITE_SCROLL_PAGINATION_RESULT_LENGTH: 5,
};

export default AppConstants;

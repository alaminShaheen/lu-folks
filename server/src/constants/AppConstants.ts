import process from "process";

const AppConstants = {
	GOOGLE_OAUTH_TOKEN_URL: "https://www.googleapis.com/oauth2/v4/token",
	GOOGLE_OAUTH_GET_USER_URL: "https://www.googleapis.com/oauth2/v1/userinfo",
	GOOGLE_OAUTH_REGISTRATION_REDIRECT_URL: `${process.env.SERVER_HOST}/api/auth/oauth/google/register`,
	GOOGLE_OAUTH_LOGIN_REDIRECT_URL: `${process.env.SERVER_HOST}/api/auth/oauth/google/login`,
	JWT_COOKIE_NAME: "jwt",
	JWT_ACCESS_TOKEN_DURATION: 60 * 3,
	JWT_REFRESH_TOKEN_DURATION: 24 * 60 * 60 * 1000,
};

export default AppConstants;

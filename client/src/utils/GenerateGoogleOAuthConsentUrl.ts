import AppConstants from "@/constants/AppConstants.ts";

function GenerateGoogleOAuthConsentUrl() {
	const googleOauthSearchParams = new URLSearchParams({
		redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL,
		client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scopes: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	});

	console.log(`${AppConstants.GOOGLE_OAUTH_ROOT_URL}?${googleOauthSearchParams.toString()}`);

	return `${AppConstants.GOOGLE_OAUTH_ROOT_URL}?${googleOauthSearchParams.toString()}`;
}

export default GenerateGoogleOAuthConsentUrl;

import AppConstants from "@/constants/AppConstants.ts";

function GenerateGoogleOAuthConsentUrl(redirectUri: string) {
	const googleOauthSearchParams = new URLSearchParams({
		redirect_uri: redirectUri,
		client_id: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
		access_type: "offline",
		response_type: "code",
		prompt: "consent",
		scope: [
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		].join(" "),
	});
	return `${AppConstants.GOOGLE_OAUTH_ROOT_URL}?${googleOauthSearchParams.toString()}`;
}

export default GenerateGoogleOAuthConsentUrl;

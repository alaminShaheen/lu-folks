type GoogleOAuthTokenResponse = {
	id_token: string;
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
};

export default GoogleOAuthTokenResponse;

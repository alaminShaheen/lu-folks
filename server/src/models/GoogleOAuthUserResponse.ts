type GoogleOAuthUserResponse = {
	sub: string;
	email: string;
	verified_email: boolean;
	name: string;
	picture: string;
	given_name: string;
	family_name: string;
};

export default GoogleOAuthUserResponse;

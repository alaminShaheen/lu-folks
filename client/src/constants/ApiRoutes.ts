const AUTH_BASE_ROUTE = "/auth";
const USER_BASE_ROUTE = "/users";
export const GROUP_BASE_ROUTE = "/group";
export const USER_ROUTES = {
	CURRENT_USER: `${USER_BASE_ROUTE}/current-user`,
};

export const AUTH_ROUTES = {
	LOGIN: `${AUTH_BASE_ROUTE}/login`,
	REGISTER: `${AUTH_BASE_ROUTE}/register`,
	LOGOUT: `${AUTH_BASE_ROUTE}/logout`,
	REFRESH_TOKEN: `${AUTH_BASE_ROUTE}/refresh-token`,
};

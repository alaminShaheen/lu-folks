import { useCallback } from "react";
import Authentication from "@/models/Authentication.ts";
import { AUTH_ROUTES } from "@/constants/ApiRoutes.ts";
import { publicAxiosInstance } from "@/api/Axios.ts";

const UseRefreshToken = () => {
	const refresh = useCallback(async (): Promise<string> => {
		const response = await publicAxiosInstance.post<Authentication>(
			AUTH_ROUTES.REFRESH_TOKEN,
			{},
		);
		return response.data.accessToken;
	}, []);

	return { refresh };
};

export default UseRefreshToken;

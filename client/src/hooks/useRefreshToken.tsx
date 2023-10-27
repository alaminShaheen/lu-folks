import { useCallback } from "react";
import Authentication from "@/models/Authentication.ts";
import { publicAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";

const UseRefreshToken = () => {
	const refresh = useCallback(async (): Promise<string> => {
		const response = await publicAxiosInstance.post<Authentication>(
			APILinks.refreshToken(),
			{},
		);
		return response.data.accessToken;
	}, []);

	return { refresh };
};

export default UseRefreshToken;

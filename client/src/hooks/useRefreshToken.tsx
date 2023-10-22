import { AUTH_ROUTES } from "@/constants/ApiRoutes.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import Authentication from "@/models/Authentication.ts";
import { publicAxiosInstance } from "@/api/Axios.ts";

const UseRefreshToken = () => {
	const { setAuthentication } = useAppContext();
	const refresh = async (): Promise<string> => {
		const response = await publicAxiosInstance.post<Authentication>(
			AUTH_ROUTES.REFRESH_TOKEN,
			{},
		);
		setAuthentication((prev) => ({ ...prev, accessToken: response.data.accessToken }));
		return response.data.accessToken;
	};

	return { refresh };
};

export default UseRefreshToken;

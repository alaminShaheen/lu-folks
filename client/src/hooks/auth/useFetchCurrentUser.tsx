import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import User from "@/models/User.ts";
import APILinks from "@/constants/APILinks.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

type UseFetchCurrentUserProps = {
	accessToken: string;
};
const UseFetchCurrentUser = (props: UseFetchCurrentUserProps) => {
	const { accessToken } = props;

	return useQuery({
		queryKey: [QueryKeys.CURRENT_USER],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<User>(APILinks.currentUser());
			return data;
		},
		refetchOnMount: false,
		enabled: !!accessToken,
	});
};

export default UseFetchCurrentUser;

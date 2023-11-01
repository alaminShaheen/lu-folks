import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import User from "@/models/User.ts";
import APILinks from "@/constants/APILinks.ts";

type UseFetchCurrentUserProps = {
	accessToken: string;
};
const UseFetchCurrentUser = (props: UseFetchCurrentUserProps) => {
	const { accessToken } = props;
	const { privateAxiosInstance } = useAxiosInstance();

	return useQuery({
		queryKey: [QueryKeys.CURRENT_USER],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<User>(APILinks.currentUser());
			return data;
		},
		enabled: !!accessToken,
	});
};

export default UseFetchCurrentUser;

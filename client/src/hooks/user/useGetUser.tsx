import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import User from "@/models/User.ts";
import { useQuery } from "@tanstack/react-query";

type UseGetUserProp = {
	userId: string;
};

const UserGetUser = (props: UseGetUserProp) => {
	const { userId } = props;
	return useQuery({
		queryKey: [QueryKeys.SINGLE_USER, userId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<User>(APILinks.getUser(userId));
			return data;
		},
	});
};

export default UserGetUser;

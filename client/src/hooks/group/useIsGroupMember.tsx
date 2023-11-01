import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import QueryKeys from "@/constants/QueryKeys.ts";
import APILinks from "@/constants/APILinks.ts";
import IsMemberResponse from "@/models/IsMemberResponse.ts";
import { useQuery } from "@tanstack/react-query";

const UseIsGroupMember = (groupId: string) => {
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();

	return useQuery({
		queryKey: [QueryKeys.IS_GROUP_MEMBER, groupId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<IsMemberResponse>(
				APILinks.fetchUserSubscription(groupId),
			);
			return data.isMember;
		},
		initialData: () => false,
	});
};

export default UseIsGroupMember;

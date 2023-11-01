import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import QueryKeys from "@/constants/QueryKeys.ts";
import APILinks from "@/constants/APILinks.ts";
import GroupMemberCount from "@/models/GroupMemberCount.ts";
import { useQuery } from "@tanstack/react-query";

const UseGroupMemberCount = (groupId: string) => {
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();

	return useQuery({
		queryKey: [QueryKeys.GROUP_MEMBER_COUNT, groupId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<GroupMemberCount>(
				APILinks.fetchGroupMemberCount(groupId),
			);
			return data.count;
		},
		initialData: () => 0,
	});
};

export default UseGroupMemberCount;

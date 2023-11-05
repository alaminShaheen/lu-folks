import QueryKeys from "@/constants/QueryKeys.ts";
import APILinks from "@/constants/APILinks.ts";
import GroupMemberCount from "@/models/GroupMemberCount.ts";
import { useQuery } from "@tanstack/react-query";
import { privateAxiosInstance } from "@/api/Axios.ts";

const UseGroupMemberCount = (groupId: string) => {
	return useQuery({
		queryKey: [QueryKeys.GROUP_MEMBER_COUNT, groupId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<GroupMemberCount>(
				APILinks.fetchGroupMemberCount(groupId),
			);
			return data.count;
		},
		initialData: () => 0,
	});
};

export default UseGroupMemberCount;

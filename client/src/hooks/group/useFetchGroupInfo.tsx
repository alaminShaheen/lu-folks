import { useQuery } from "@tanstack/react-query";
import APILinks from "@/constants/APILinks.ts";
import GroupInfo from "@/models/GroupInfo.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

const UseFetchGroupInfo = (groupId: string) => {
	return useQuery({
		queryKey: [QueryKeys.GROUP_INFO, groupId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<GroupInfo>(
				APILinks.getGroupInfo(groupId),
			);
			return data;
		},
	});
};

export default UseFetchGroupInfo;

import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import ExtendedGroup from "@/models/ExtendedGroup.ts";
import APILinks from "@/constants/APILinks.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

const UseFetchGroupDetails = (groupId: string) => {
	return useQuery({
		queryKey: [QueryKeys.GROUP_DETAILS, groupId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<ExtendedGroup>(
				APILinks.getGroupData(groupId),
			);
			return new ExtendedGroup(
				data.id,
				data.title,
				data.createdAt,
				data.updatedAt,
				data.posts,
				data.creator,
			);
		},
		initialData: () => ExtendedGroup.EMPTY,
	});
};

export default UseFetchGroupDetails;

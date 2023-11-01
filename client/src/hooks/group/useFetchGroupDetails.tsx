import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import ExtendedGroup from "@/models/ExtendedGroup.ts";
import APILinks from "@/constants/APILinks.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";

const UseFetchGroupDetails = (groupId: string) => {
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();

	return useQuery({
		queryKey: [QueryKeys.GROUP_DETAILS, groupId],
		queryFn: async () => {
			const { data } = await axiosInstance.get<ExtendedGroup>(APILinks.getGroupData(groupId));
			return new ExtendedGroup(
				data.id,
				data.title,
				new Date(data.createdAt),
				new Date(data.updatedAt),
				data.posts,
				data.creator,
			);
		},
		initialData: () => ExtendedGroup.EMPTY,
	});
};

export default UseFetchGroupDetails;

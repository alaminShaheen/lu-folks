import QueryKeys from "@/constants/QueryKeys.ts";
import APILinks from "@/constants/APILinks.ts";
import IsMemberResponse from "@/models/IsMemberResponse.ts";
import { useQuery } from "@tanstack/react-query";
import { privateAxiosInstance } from "@/api/Axios.ts";

const UseIsGroupMember = (groupId: string) => {
	return useQuery({
		queryKey: [QueryKeys.IS_GROUP_MEMBER, groupId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<IsMemberResponse>(
				APILinks.fetchUserSubscription(groupId),
			);
			return data.isMember;
		},
		initialData: () => false,
	});
};

export default UseIsGroupMember;

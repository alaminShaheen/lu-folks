import { useInfiniteQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import SuggestedGroupInfo from "@/models/SuggestedGroupInfo.ts";
import APILinks from "@/constants/APILinks.ts";
import PaginatedResponse from "@/models/PaginatedResponse.ts";

const useGroupSuggestion = () => {
	return useInfiniteQuery({
		queryKey: [QueryKeys.GROUP_SUGGESTIONS],
		queryFn: async ({ pageParam }: { pageParam?: string }) => {
			const { data } = await privateAxiosInstance.get<PaginatedResponse<SuggestedGroupInfo>>(
				APILinks.getSuggestedGroups(pageParam),
			);
			return data;
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
	});
};

export default useGroupSuggestion;

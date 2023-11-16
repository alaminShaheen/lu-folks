import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import SearchResult from "@/models/SearchResult.ts";

type UseSearchGroupsProps = {
	searchTerm: string;
};

const UseSearchGroups = (props: UseSearchGroupsProps) => {
	const { searchTerm } = props;
	return useQuery({
		queryKey: [QueryKeys.SEARCH_GROUPS],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<SearchResult>(
				APILinks.search(searchTerm),
			);
			return data;
		},
		enabled: false,
	});
};

export default UseSearchGroups;

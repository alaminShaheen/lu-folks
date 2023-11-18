import { useInfiniteQuery } from "@tanstack/react-query";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import PaginatedResponse from "@/models/PaginatedResponse.ts";

type UseFetchPaginatedPostsProps = {
	groupSlug?: string;
};

const UseFetchPaginatedPosts = (props: UseFetchPaginatedPostsProps) => {
	const { groupSlug } = props;

	return useInfiniteQuery({
		queryKey: [QueryKeys.FETCH_INFINITE_POST, groupSlug],
		queryFn: async ({ pageParam }: { pageParam?: string }) => {
			const { data } = await privateAxiosInstance.get<PaginatedResponse<ExtendedPost>>(
				APILinks.getPosts(pageParam, groupSlug),
			);
			return data;
		},
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
	});
};

export default UseFetchPaginatedPosts;

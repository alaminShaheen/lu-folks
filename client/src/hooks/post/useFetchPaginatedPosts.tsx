import { useInfiniteQuery } from "@tanstack/react-query";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import AppConstants from "@/constants/AppConstants.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

type UseFetchPaginatedPostsProps = {
	initialPageParam?: number;
	groupSlug?: string;
	limit?: number;
	initialPosts?: ExtendedPost[];
};

const UseFetchPaginatedPosts = (props: UseFetchPaginatedPostsProps) => {
	const {
		initialPageParam = 0,
		limit = AppConstants.INFINITE_SCROLL_PAGINATION_RESULT_LENGTH,
		groupSlug,
		initialPosts = [],
	} = props;

	return useInfiniteQuery({
		queryKey: [QueryKeys.FETCH_INFINITE_POST, groupSlug],
		queryFn: async ({ pageParam = 1 }) => {
			const { data } = await privateAxiosInstance.get<ExtendedPost[]>(
				APILinks.getPosts(limit, pageParam, groupSlug),
			);
			return data;
		},
		initialPageParam: initialPageParam,
		initialData: {
			pages: [initialPosts],
			pageParams: [1],
		},
		getNextPageParam: (_, pages) => pages.length + 1,
		enabled: !!groupSlug,
	});
};

export default UseFetchPaginatedPosts;

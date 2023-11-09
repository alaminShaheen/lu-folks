import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";

const UseGetInitialFeedPosts = () => {
	return useQuery({
		queryKey: [QueryKeys.INITIAL_FEED_POSTS],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<ExtendedPost[]>(
				APILinks.getInitialFeedPosts(),
			);
			return data;
		},
	});
};

export default UseGetInitialFeedPosts;

import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";

type UseGetPostProp = {
	postSlug: string;
};
const UseGetPost = (props: UseGetPostProp) => {
	const { postSlug } = props;
	return useQuery({
		queryKey: [QueryKeys.GET_POST],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<ExtendedPost>(
				APILinks.getPost(postSlug),
			);
			return data;
		},
	});
};

export default UseGetPost;

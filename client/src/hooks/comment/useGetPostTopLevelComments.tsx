import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import Comment from "@/models/Comment.ts";

type UseGetPostCommentsProps = {
	postId: string;
};

const UseGetPostTopLevelComments = (props: UseGetPostCommentsProps) => {
	const { postId } = props;
	return useQuery({
		queryKey: [QueryKeys.GET_POST_COMMENTS, postId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<Comment[]>(
				APILinks.getPostComments(postId),
			);
			return data;
		},
	});
};

export default UseGetPostTopLevelComments;

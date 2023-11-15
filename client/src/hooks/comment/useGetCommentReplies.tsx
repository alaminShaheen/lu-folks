import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import Comment from "@/models/Comment.ts";

type UseGetCommentRepliesProps = {
	parentCommentId: string;
};

const UseGetCommentReplies = (props: UseGetCommentRepliesProps) => {
	const { parentCommentId } = props;
	return useQuery({
		queryKey: [QueryKeys.GET_COMMENT_REPLIES, parentCommentId],
		queryFn: async () => {
			const { data } = await privateAxiosInstance.get<Comment[]>(
				APILinks.getCommentReplies(parentCommentId),
			);
			return data;
		},
	});
};

export default UseGetCommentReplies;

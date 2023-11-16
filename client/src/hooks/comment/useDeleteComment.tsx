import { useMutation } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import Comment from "@/models/Comment.ts";

type UseDeleteCommentProps = {
	commentId: string;
	onSuccess: (data: Comment) => void;
};

const UseDeleteComment = (props: UseDeleteCommentProps) => {
	const { commentId, onSuccess } = props;

	return useMutation({
		mutationKey: [QueryKeys.DELETE_COMMENT],
		mutationFn: async () => {
			const { data } = await privateAxiosInstance.delete<Comment>(
				APILinks.deleteComment(commentId),
			);
			return data;
		},
		onSuccess,
	});
};

export default UseDeleteComment;

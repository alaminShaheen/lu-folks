import { useMutation } from "@tanstack/react-query";
import Comment from "@/models/Comment.ts";
import APILinks from "@/constants/APILinks.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

type UseDeleteCommentProps = {
	commentId: string;
	onSuccess: (data: Comment) => void;
};

const useDeleteComment = (props: UseDeleteCommentProps) => {
	const { commentId, onSuccess } = props;

	return useMutation({
		mutationFn: async () => {
			const { data } = await privateAxiosInstance.delete<Comment>(
				APILinks.deleteComment(commentId),
			);
			return data;
		},
		onSuccess,
	});
};

export default useDeleteComment;

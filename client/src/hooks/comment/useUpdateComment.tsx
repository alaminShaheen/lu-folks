import { useMutation } from "@tanstack/react-query";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import Comment from "@/models/Comment.ts";
import UpdateComment from "@/models/form/UpdateComment.ts";

type UseUpdateCommentProps = {
	commentId: string;
	onSuccess: (data: Comment) => void;
};

const UseUpdateComment = (props: UseUpdateCommentProps) => {
	const { commentId, onSuccess } = props;
	return useMutation({
		mutationFn: async (commentInfo: UpdateComment) => {
			const { data } = await privateAxiosInstance.patch<Comment>(
				APILinks.updateComment(commentId),
				commentInfo,
			);
			return data;
		},
		onSuccess,
	});
};

export default UseUpdateComment;

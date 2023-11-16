import { useMutation } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import Comment from "@/models/Comment.ts";
import UpdateComment from "@/models/form/UpdateComment.ts";

type UserUpdateCommentProps = {
	commentId: string;
	onSuccess: (data: Comment) => void;
};

const UserUpdateComment = (props: UserUpdateCommentProps) => {
	const { commentId, onSuccess } = props;
	return useMutation({
		mutationKey: [QueryKeys.UPDATE_COMMENT],
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

export default UserUpdateComment;

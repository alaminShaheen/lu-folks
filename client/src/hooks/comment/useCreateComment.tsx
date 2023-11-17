import { useMutation } from "@tanstack/react-query";
import Comment from "@/models/Comment.ts";
import APILinks from "@/constants/APILinks.ts";
import handleError from "@/utils/handleError.ts";
import CreateComment from "@/models/CreateComment.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

interface UseCreateCommentProps {
	onSuccess: (data: Comment) => void;
}

const UseCreateComment = (props: UseCreateCommentProps) => {
	const { onSuccess } = props;
	return useMutation({
		mutationFn: async (commentInfo: CreateComment) => {
			const { data } = await privateAxiosInstance.post<Comment>(
				APILinks.createComment(),
				commentInfo,
			);
			return data;
		},
		onError: (error: any) => {
			handleError(error);
		},
		onSuccess,
	});
};

export default UseCreateComment;

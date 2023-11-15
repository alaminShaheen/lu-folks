import { useMutation } from "@tanstack/react-query";
import QueryKeys from "@/constants/QueryKeys.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import CreateComment from "@/models/CreateComment.ts";
import handleError from "@/utils/handleError.ts";

interface UseCreateCommentProps {
	onSuccess: () => void;
}

const UseCreateComment = (props: UseCreateCommentProps) => {
	const { onSuccess } = props;
	return useMutation({
		mutationKey: [QueryKeys.CREATE_COMMENT],
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

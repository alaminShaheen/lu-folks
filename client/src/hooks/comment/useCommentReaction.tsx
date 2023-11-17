import { useMutation } from "@tanstack/react-query";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import CreateCommentReaction from "@/models/CreateCommentReaction.ts";

interface UsePostReactProps {
	onError: (error: any, reactionInfo: CreateCommentReaction) => void;
	onSuccess: () => void;
	onMutate: (reactionInfo: CreateCommentReaction) => void;
}

const UseCommentReaction = (props: UsePostReactProps) => {
	const { onError, onSuccess, onMutate } = props;
	return useMutation({
		mutationFn: async (reactionInfo: CreateCommentReaction) => {
			const { data } = await privateAxiosInstance.patch<void>(
				APILinks.reactToComment(),
				reactionInfo,
			);
			return data;
		},
		onError,
		onSuccess,
		onMutate,
	});
};

export default UseCommentReaction;

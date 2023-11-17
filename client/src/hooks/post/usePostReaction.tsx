import { useMutation } from "@tanstack/react-query";
import CreatePostReaction from "@/models/CreatePostReaction.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";

interface UsePostReactProps {
	onError: (error: any, reactionInfo: CreatePostReaction) => void;
	onSuccess: () => void;
	onMutate: (reactionInfo: CreatePostReaction) => void;
}

const UsePostReaction = (props: UsePostReactProps) => {
	const { onError, onSuccess, onMutate } = props;
	return useMutation({
		mutationFn: async (reactionInfo: CreatePostReaction) => {
			const { data } = await privateAxiosInstance.patch<void>(
				APILinks.reactToPost(),
				reactionInfo,
			);
			return data;
		},
		onError,
		onSuccess,
		onMutate,
	});
};

export default UsePostReaction;

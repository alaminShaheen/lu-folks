import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import { useMutation } from "@tanstack/react-query";
import ServiceHookCommonProps from "@/models/ServiceHookCommonProps.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";

type UseDeletePostProps = {
	postId: string;
} & ServiceHookCommonProps<ExtendedPost>;

const useDeletePost = (props: UseDeletePostProps) => {
	const { postId, onSuccess } = props;
	return useMutation({
		mutationFn: async () => {
			const { data } = await privateAxiosInstance.delete<ExtendedPost>(
				APILinks.deletePost(postId),
			);
			return data;
		},
		onSuccess,
	});
};

export default useDeletePost;

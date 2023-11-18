import { useMutation } from "@tanstack/react-query";
import APILinks from "@/constants/APILinks.ts";
import UpdatePost from "@/models/form/UpdatePost.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";
import ServiceHookCommonProps from "@/models/ServiceHookCommonProps.ts";

type UseUpdatePostProps = {
	postId: string;
} & ServiceHookCommonProps<ExtendedPost>;

const useUpdatePost = (props: UseUpdatePostProps) => {
	const { postId, onSuccess } = props;
	return useMutation({
		mutationFn: async (postInfo: UpdatePost) => {
			const { data } = await privateAxiosInstance.patch<ExtendedPost>(
				APILinks.updatePost(postId),
				postInfo,
			);
			return data;
		},
		onSuccess,
	});
};

export default useUpdatePost;

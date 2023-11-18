import { useMutation } from "@tanstack/react-query";
import APILinks from "@/constants/APILinks.ts";
import PostCreate from "@/models/form/PostCreate.ts";
import handleError from "@/utils/handleError.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import ServiceHookCommonProps from "@/models/ServiceHookCommonProps.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

interface UseCreatePostProps extends ServiceHookCommonProps<ExtendedPost> {}

const UseCreatePost = (props: UseCreatePostProps) => {
	const { onSuccess } = props;

	return useMutation({
		mutationFn: async (formData: PostCreate) => {
			const { data } = await privateAxiosInstance.post<ExtendedPost>(
				APILinks.createPost(),
				formData,
			);
			return data;
		},
		onSuccess,
		onError: (error) => handleError(error),
	});
};

export default UseCreatePost;

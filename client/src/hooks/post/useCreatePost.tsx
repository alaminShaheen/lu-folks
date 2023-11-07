import { useMutation } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import PostCreate from "@/models/form/PostCreate.ts";
import handleError from "@/utils/handleError.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import ServiceHookCommonProps from "@/models/ServiceHookCommonProps.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

interface UseCreatePostProps extends ServiceHookCommonProps<void> {
	setError: UseFormSetError<PostCreate>;
}

const UseCreatePost = (props: UseCreatePostProps) => {
	const { setError, onSuccess } = props;

	return useMutation({
		mutationKey: [QueryKeys.CREATE_POST],
		mutationFn: async (formData: PostCreate) => {
			const { data } = await privateAxiosInstance.post<ExtendedPost>(
				APILinks.createPost(),
				formData,
			);
			return data;
		},
		onSuccess,
		onError: (error) => handleError(error, setError),
	});
};

export default UseCreatePost;

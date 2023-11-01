import { UseFormSetError } from "react-hook-form";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import PostCreate from "@/models/form/PostCreate.ts";
import handleError from "@/utils/handleError.ts";
import RegisterForm from "@/models/form/RegisterForm.ts";
import { useMutation } from "@tanstack/react-query";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";

type UseCreatePostProps = {
	setError: UseFormSetError<any>;
	onSuccess: () => Promise<void>;
};

const UseCreatePost = (props: UseCreatePostProps) => {
	const { setError, onSuccess } = props;
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();

	return useMutation({
		mutationKey: [QueryKeys.CREATE_POST],
		mutationFn: async (formData: PostCreate) => {
			const { data } = await axiosInstance.post<void>(APILinks.createPost(), formData);
			return data;
		},
		onSuccess,
		onError: (error) => handleError<RegisterForm>(error, setError),
	});
};

export default UseCreatePost;

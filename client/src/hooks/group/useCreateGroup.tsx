import { useMutation } from "@tanstack/react-query";
import { UseFormSetError } from "react-hook-form";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import handleError from "@/utils/handleError.ts";
import ExtendedGroup from "@/models/ExtendedGroup.ts";
import CreateGroupForm from "@/models/form/CreateGroupForm.ts";
import ServiceHookCommonProps from "@/models/ServiceHookCommonProps.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

interface UseCreateGroupProps extends ServiceHookCommonProps<CreateGroupForm> {
	setError: UseFormSetError<CreateGroupForm>;
}

const UseCreateGroup = (props: UseCreateGroupProps) => {
	const { setError, onSuccess } = props;

	return useMutation({
		mutationKey: [QueryKeys.CREATE_GROUP],
		mutationFn: async (formValues: CreateGroupForm) => {
			const { data } = await privateAxiosInstance.post<ExtendedGroup>(
				APILinks.createGroup(),
				formValues,
			);
			return data;
		},
		onSuccess,
		onError: (error) => handleError(error, setError),
	});
};

export default UseCreateGroup;

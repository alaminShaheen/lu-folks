import { privateAxiosInstance } from "@/api/Axios.ts";
import APILinks from "@/constants/APILinks.ts";
import User from "@/models/User.ts";
import { useMutation } from "@tanstack/react-query";
import ServiceHookCommonProps from "@/models/ServiceHookCommonProps.ts";
import ProfileForm from "@/models/ProfileForm.ts";

type UseUpdateUserProps = {} & ServiceHookCommonProps<User>;

const UseUpdateUser = (props: UseUpdateUserProps) => {
	const { onSuccess } = props;
	return useMutation({
		mutationFn: async (updatedUserInfo: ProfileForm) => {
			const { data } = await privateAxiosInstance.patch<User>(
				APILinks.updateUser(),
				updatedUserInfo,
			);
			return data;
		},
		onSuccess,
	});
};

export default UseUpdateUser;

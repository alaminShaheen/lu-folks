import { toast } from "react-toastify";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import { Button } from "@/components/ui/button.tsx";
import handleError from "@/utils/handleError.ts";
import { privateAxiosInstance } from "@/api/Axios.ts";

interface ToggleSubscriptionButtonProps {
	groupTitle: string;
	groupId: string;
	isGroupMember: boolean;
}

const ToggleSubscriptionButton = (props: ToggleSubscriptionButtonProps) => {
	const { groupId, groupTitle, isGroupMember } = props;
	const queryClient = useQueryClient();

	const { mutate: joinGroup, isPending: joiningGroup } = useMutation({
		mutationKey: [QueryKeys.JOIN_GROUP],
		mutationFn: async () => {
			const { data } = await privateAxiosInstance.post<void>(APILinks.joinGroup(groupId), {});
			return data;
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success(`You have joined the group: ${groupTitle}`);
			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.GROUP_INFO],
			});
		},
		onError: (error: any) => handleError(error),
	});

	const { mutate: leaveGroup, isPending: leavingGroup } = useMutation({
		mutationKey: [QueryKeys.LEAVE_GROUP],
		mutationFn: async () => {
			const { data } = await privateAxiosInstance.delete<void>(APILinks.leaveGroup(groupId));
			return data;
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success(`You have left the group: ${groupTitle}`);
			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.GROUP_DETAILS],
			});
			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.GROUP_MEMBER_COUNT],
			});
			await queryClient.invalidateQueries({
				queryKey: [QueryKeys.IS_GROUP_MEMBER],
			});
		},
		onError: (error: any) => handleError(error),
	});

	const onJoinGroup = useCallback(() => {
		void joinGroup();
	}, [joinGroup]);

	const onLeaveGroup = useCallback(() => {
		void leaveGroup();
	}, [leaveGroup]);

	return isGroupMember ? (
		<Button
			className="w-full mt-1 mb-4"
			loading={leavingGroup || joiningGroup}
			onClick={onLeaveGroup}
			variant="destructive"
		>
			Leave community
		</Button>
	) : (
		<Button
			className="w-full mt-1 mb-4"
			loading={joiningGroup || leavingGroup}
			onClick={onJoinGroup}
		>
			Join to post
		</Button>
	);
};

export default ToggleSubscriptionButton;

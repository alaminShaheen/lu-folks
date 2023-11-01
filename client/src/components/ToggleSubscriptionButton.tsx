import { toast } from "react-toastify";
import { useCallback } from "react";
import APILinks from "@/constants/APILinks.ts";
import QueryKeys from "@/constants/QueryKeys.ts";
import { Button } from "@/components/ui/button.tsx";
import handleError from "@/utils/handleError.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import useIsGroupMember from "@/hooks/group/useIsGroupMember.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ToggleSubscriptionButtonProps {
	groupTitle: string;
	groupId: string;
}

const ToggleSubscriptionButton = (props: ToggleSubscriptionButtonProps) => {
	const { groupId, groupTitle } = props;
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const queryClient = useQueryClient();
	const { data: isGroupMember, isLoading: fetchingIsGroupMember } = useIsGroupMember(groupId);

	const { mutate: joinGroup, isPending: joiningGroup } = useMutation({
		mutationKey: [QueryKeys.JOIN_GROUP],
		mutationFn: async () => {
			const { data } = await axiosInstance.post<void>(APILinks.joinGroup(groupId), {});
			return data;
		},
		onSuccess: async () => {
			toast.dismiss();
			toast.success(`You have joined the group: ${groupTitle}`);
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

	const { mutate: leaveGroup, isPending: leavingGroup } = useMutation({
		mutationKey: [QueryKeys.LEAVE_GROUP],
		mutationFn: async () => {
			const { data } = await axiosInstance.delete<void>(APILinks.leaveGroup(groupId));
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

	// const joinGroup = useCallback(async () => {
	// 	try {
	// 		await axiosInstance.post<void>(APILinks.joinGroup(group.id), {});
	// 		toast.dismiss();
	// 		toast.success(`You have joined the group: ${group.title}`);
	// 		onSubscriptionChange();
	// 	} catch (error: any) {
	// 		if (error instanceof AxiosError) {
	// 			if (error.response?.data.type === ApiErrorType.GENERAL) {
	// 				toast.error(error.response?.data.message);
	// 			}
	// 		} else {
	// 			onSubscriptionChange();
	// 			toast.error(error.message);
	// 		}
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// }, [axiosInstance, group.id, group.title, onSubscriptionChange]);

	// const leaveGroup = useCallback(async () => {
	// 	try {
	// 		setLoading(true);
	// 		await axiosInstance.delete<void>(APILinks.leaveGroup(group.id));
	// 		toast.dismiss();
	// 		toast.success(`You have left the group: ${group.title}`);
	// 		onSubscriptionChange();
	// 	} catch (error: any) {
	// 		if (error instanceof AxiosError) {
	// 			if (error.response?.data.type === ApiErrorType.GENERAL) {
	// 				toast.error(error.response?.data.message);
	// 			}
	// 		} else {
	// 			toast.error(error.message);
	// 		}
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// }, [axiosInstance, group.id, group.title, onSubscriptionChange]);

	const onJoinGroup = useCallback(() => {
		void joinGroup();
	}, [joinGroup]);

	const onLeaveGroup = useCallback(() => {
		void leaveGroup();
	}, [leaveGroup]);

	return isGroupMember ? (
		<Button
			className="w-full mt-1 mb-4"
			loading={leavingGroup}
			disabled={fetchingIsGroupMember}
			onClick={onLeaveGroup}
			variant="destructive"
		>
			Leave community
		</Button>
	) : (
		<Button
			className="w-full mt-1 mb-4"
			loading={joiningGroup}
			disabled={fetchingIsGroupMember}
			onClick={onJoinGroup}
		>
			Join to post
		</Button>
	);
};

export default ToggleSubscriptionButton;

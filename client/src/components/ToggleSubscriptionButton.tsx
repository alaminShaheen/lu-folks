import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import APILinks from "@/constants/APILinks.ts";
import { Button } from "@/components/ui/button.tsx";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import { useGroupContext } from "@/context/GroupContext.tsx";

interface ToggleSubscriptionButtonProps {
	onSubscriptionChange: () => void;
}

const ToggleSubscriptionButton = (props: ToggleSubscriptionButtonProps) => {
	const { onSubscriptionChange } = props;
	const { isMember, group } = useGroupContext();
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const [loading, setLoading] = useState(false);

	const joinGroup = useCallback(async () => {
		try {
			setLoading(true);
			await axiosInstance.post<void>(APILinks.joinGroup(group.id), {});
			toast.dismiss();
			toast.success(`You have joined the group: ${group.title}`);
			onSubscriptionChange();
		} catch (error: any) {
			if (error instanceof AxiosError) {
				if (error.response?.data.type === ApiErrorType.GENERAL) {
					toast.error(error.response?.data.message);
				}
			} else {
				onSubscriptionChange();
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, group.id, group.title, onSubscriptionChange]);

	const leaveGroup = useCallback(async () => {
		try {
			setLoading(true);
			await axiosInstance.delete<void>(APILinks.leaveGroup(group.id));
			toast.dismiss();
			toast.success(`You have left the group: ${group.title}`);
			onSubscriptionChange();
		} catch (error: any) {
			if (error instanceof AxiosError) {
				if (error.response?.data.type === ApiErrorType.GENERAL) {
					toast.error(error.response?.data.message);
				}
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, group.id, group.title, onSubscriptionChange]);

	return isMember ? (
		<Button
			className="w-full mt-1 mb-4"
			loading={loading}
			onClick={leaveGroup}
			variant="destructive"
		>
			Leave community
		</Button>
	) : (
		<Button className="w-full mt-1 mb-4" loading={loading} onClick={joinGroup}>
			Join to post
		</Button>
	);
};

export default ToggleSubscriptionButton;

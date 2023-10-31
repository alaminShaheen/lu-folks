import { toast } from "react-toastify";
import { format } from "date-fns";
import { AxiosError } from "axios";
import { Outlet, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ExtendedGroup from "@/models/ExtendedGroup.ts";
import ROUTES from "@/constants/Routes.ts";
import APILinks from "@/constants/APILinks.ts";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import GroupMemberCount from "@/models/GroupMemberCount.ts";
import IsMemberResponse from "@/models/IsMemberResponse.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import { useGroupContext } from "@/context/GroupContext.tsx";
import ToggleSubscriptionButton from "@/components/ToggleSubscriptionButton.tsx";

const GroupLayout = () => {
	const { user } = useAppContext();
	const params = useParams<"slug">();
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const { group, setGroupMemberCount, setGroup, setIsMember, groupMemberCount } =
		useGroupContext();
	const [, setLoading] = useState(false);

	const fetchGroupDetails = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.get<ExtendedGroup>(
				APILinks.getGroupData(params.slug!),
			);
			setGroup(
				new ExtendedGroup(
					data.id,
					data.title,
					new Date(data.createdAt),
					new Date(data.updatedAt),
					data.posts,
					data.creator,
				),
			);
		} catch (error: any) {
			toast.dismiss();
			if (error.response.data.type === ApiErrorType.GENERAL) {
				toast.error(error.response.data.message);
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, params.slug, setGroup]);

	const fetchGroupMembershipCount = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.get<GroupMemberCount>(
				APILinks.fetchGroupMemberCount(params.slug!),
			);
			setGroupMemberCount(data.count);
		} catch (error: any) {
			toast.dismiss();
			if (error instanceof AxiosError) {
				if (error.response?.data.type === ApiErrorType.GENERAL) {
					toast.error(error.response.data.message);
				}
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, params.slug, setGroupMemberCount]);

	const fetchUserSubscription = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.get<IsMemberResponse>(
				APILinks.fetchUserSubscription(params.slug!),
			);
			setIsMember(data.isMember);
		} catch (error: any) {
			toast.dismiss();
			if (error instanceof AxiosError) {
				if (error.response?.data.type === ApiErrorType.GENERAL) {
					toast.error(error.response.data.message);
				}
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	}, [axiosInstance, params.slug, setIsMember]);

	const fetchGroupData = useCallback(() => {
		void Promise.all([
			fetchUserSubscription(),
			fetchGroupDetails(),
			fetchGroupMembershipCount(),
		]);
	}, [fetchGroupDetails, fetchGroupMembershipCount, fetchUserSubscription]);

	useEffect(() => {
		fetchGroupData();
	}, [fetchGroupData]);

	return (
		<div className="sm:container max-w-7xl mx-auto h-full pt-12">
			<div>
				{/*<ToFeedButton />*/}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
					<ul className="flex flex-col col-span-2 space-y-6">{<Outlet />}</ul>
					{group !== ExtendedGroup.EMPTY ? (
						<div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
							<div className="px-6 py-4">
								<p className="font-semibold py-3">About {group.title}</p>
							</div>
							<dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">Created</dt>
									<dd className="text-gray-700">
										<time dateTime={group.createdAt.toDateString()}>
											{format(group.createdAt, "MMMM d, yyyy")}
										</time>
									</dd>
								</div>
								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">Members</dt>
									<dd className="flex items-start gap-x-2">
										<div className="text-gray-900">{groupMemberCount}</div>
									</dd>
								</div>
								{group.creator.id === user?.id && (
									<div className="flex justify-between gap-x-4 py-3">
										<dt className="text-gray-500">
											You created this community
										</dt>
									</div>
								)}

								{group.creator.id !== user?.id && (
									<ToggleSubscriptionButton
										onSubscriptionChange={fetchGroupData}
									/>
								)}
								<ButtonLink to={ROUTES.GROUP.CREATE_POST}>Create Post</ButtonLink>
							</dl>
						</div>
					) : (
						// TODO: Need skellies
						<div>Skellies</div>
					)}
					{/* info sidebar */}
				</div>
			</div>
			{/*<CreatePostModal groupTitle={group.title} />*/}
		</div>
	);
};

export default GroupLayout;

import { useCallback, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Group from "@/models/Group.ts";
import APILinks from "@/constants/APILinks.ts";
import { toast } from "react-toastify";
import ApiErrorType from "@/models/enums/ApiErrorType.ts";
import useAxiosInstance from "@/hooks/useAxiosInstance.tsx";
import GroupMemberCount from "@/models/GroupMemberCount.ts";
import { AxiosError } from "axios";
import { format } from "date-fns";
import IsMemberResponse from "@/models/IsMemberResponse.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import ROUTES from "@/constants/Routes.ts";
import ToggleSubscriptionButton from "@/components/ToggleSubscriptionButton.tsx";
import ButtonLink from "@/components/ui/ButtonLink.tsx";

const GroupLayout = () => {
	const { user } = useAppContext();
	const params = useParams<"slug">();
	const { privateAxiosInstance: axiosInstance } = useAxiosInstance();
	const [groupInfo, setGroupInfo] = useState<Group>(Group.EMPTY);
	const [groupMemberCount, setGroupMemberCount] = useState<number>(0);
	const [isMember, setIsMember] = useState(false);
	const [, setLoading] = useState(false);

	const fetchGroupDetails = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosInstance.get<Group>(APILinks.getGroup(params.slug!));
			setGroupInfo(
				new Group(
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
	}, [axiosInstance, params.slug]);

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
	}, [axiosInstance, params.slug]);

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
	}, [axiosInstance, params.slug]);

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

					{/* info sidebar */}
					<div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
						<div className="px-6 py-4">
							<p className="font-semibold py-3">About {groupInfo.title}</p>
						</div>
						<dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Created</dt>
								<dd className="text-gray-700">
									<time dateTime={groupInfo.createdAt.toDateString()}>
										{format(groupInfo.createdAt, "MMMM d, yyyy")}
									</time>
								</dd>
							</div>
							<div className="flex justify-between gap-x-4 py-3">
								<dt className="text-gray-500">Members</dt>
								<dd className="flex items-start gap-x-2">
									<div className="text-gray-900">{groupMemberCount}</div>
								</dd>
							</div>
							{groupInfo.creator.id === user?.id && (
								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">You created this community</dt>
								</div>
							)}

							{groupInfo.creator.id !== user?.id && (
								<ToggleSubscriptionButton
									onSubscriptionChange={fetchGroupData}
									isMember={isMember}
									groupSlug={params.slug!}
									groupTitle={groupInfo.title}
								/>
							)}
							<ButtonLink to={ROUTES.NEWS_FEED}>Create Post</ButtonLink>
						</dl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupLayout;
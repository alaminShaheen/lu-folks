import { format } from "date-fns";
import { Outlet, useParams } from "react-router-dom";
import ROUTES from "@/constants/Routes.ts";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import handleError from "@/utils/handleError.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import useFetchGroupInfo from "@/hooks/group/useFetchGroupInfo.tsx";
import GroupLayoutSkeleton from "@/components/skeletons/GroupLayoutSkeleton.tsx";
import ToggleSubscriptionButton from "@/components/ToggleSubscriptionButton.tsx";
import useRelativeRouteMatch from "@/hooks/useRelativeRouteMatch.tsx";

const GroupLayout = () => {
	const { user } = useAppContext();
	const params = useParams<"slug">();
	const {
		data: groupInfo,
		isFetching: fetchingGroup,
		isError: fetchGroupIsError,
		error: fetchGroupError,
	} = useFetchGroupInfo(params.slug!);
	const createPostRouteMatch = useRelativeRouteMatch(ROUTES.GROUP.CREATE_POST);

	if (fetchGroupIsError) {
		handleError(fetchGroupError);
	}

	return (
		<div className="sm:container max-w-7xl mx-auto h-full pt-12">
			<div>
				{/*<ToFeedButton />*/}

				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
					<ul className="flex flex-col col-span-2 space-y-6">{<Outlet />}</ul>
					{fetchingGroup || !groupInfo ? (
						<GroupLayoutSkeleton />
					) : (
						<div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
							<div className="px-6 py-4">
								<p className="font-semibold py-3">About {groupInfo.title}</p>
							</div>
							<dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
								<div className="flex justify-between gap-x-4 py-3 items-center">
									<dt className="text-gray-500">Created</dt>
									<dd className="text-gray-700">
										<time dateTime={groupInfo.createdAt}>
											{format(new Date(groupInfo.createdAt), "MMMM d, yyyy")}
										</time>
									</dd>
								</div>
								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">Members</dt>
									<dd className="flex items-start gap-x-2">
										<div className="text-gray-900">
											{groupInfo.groupMemberCount}
										</div>
									</dd>
								</div>
								{groupInfo.creatorId === user?.id && (
									<div className="flex justify-between gap-x-4 py-3">
										<dt className="text-gray-500">
											You created this community
										</dt>
									</div>
								)}

								{groupInfo.creatorId !== user?.id && (
									<ToggleSubscriptionButton
										isGroupMember={groupInfo.isMember}
										groupId={groupInfo.id}
										groupTitle={groupInfo.title}
									/>
								)}
								{!createPostRouteMatch && (
									<ButtonLink to={ROUTES.GROUP.CREATE_POST}>
										Create Post
									</ButtonLink>
								)}
							</dl>
						</div>
					)}
					{/* info sidebar */}
				</div>
			</div>
		</div>
	);
};

export default GroupLayout;

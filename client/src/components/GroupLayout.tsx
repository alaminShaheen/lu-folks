import { format } from "date-fns";
import { Link, Outlet, useParams } from "react-router-dom";
import ROUTES from "@/constants/Routes.ts";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import handleError from "@/utils/handleError.ts";
import { useAppContext } from "@/context/AppContext.tsx";
import useFetchGroupInfo from "@/hooks/group/useFetchGroupInfo.tsx";
import GroupLayoutSkeleton from "@/components/skeletons/GroupLayoutSkeleton.tsx";
import useRelativeRouteMatch from "@/hooks/useRelativeRouteMatch.tsx";
import ToggleSubscriptionButton from "@/components/ToggleSubscriptionButton.tsx";
import { ChevronLeft } from "lucide-react";
import { Fragment, useCallback } from "react";
import SideSectionWrapper from "@/components/SideSectionWrapper.tsx";

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
	const postDetailsRouteMatch = useRelativeRouteMatch(ROUTES.GROUP.POST_DETAILS);
	const groupBaseRouteMatch = useRelativeRouteMatch(ROUTES.GROUP.BASE);

	const getCorrectPath = useCallback(() => {
		if (postDetailsRouteMatch) {
			return `/group/${params.slug}`;
		} else {
			return `/home`;
		}
	}, [postDetailsRouteMatch, params.slug]);

	if (fetchGroupIsError) {
		handleError(fetchGroupError);
	}

	return (
		<div className="sm:container max-w-7xl mx-auto h-full">
			<div>
				<Link
					to={getCorrectPath()}
					className="flex items-center text-sm w-fit hover:underline"
				>
					<ChevronLeft className="h-4 w-4 mr-1" />
					{postDetailsRouteMatch || createPostRouteMatch
						? "Back to group"
						: groupBaseRouteMatch
						? "Back to home"
						: ""}
				</Link>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
					<ul className="flex flex-col col-span-2 space-y-6">{<Outlet />}</ul>
					{fetchingGroup || !groupInfo ? (
						<GroupLayoutSkeleton />
					) : (
						<Fragment>
							<SideSectionWrapper title={`About ${groupInfo.title}`}>
								<dl className="divide-y divide-gray-100 dark:divide-gray-500 px-6 py-4 text-sm leading-6">
									<div className="flex justify-between gap-x-4 py-3 items-center">
										<dt className="text-gray-500 dark:text-gray-400">
											Created
										</dt>
										<dd className="text-gray-700 dark:text-gray-400">
											<time dateTime={groupInfo.createdAt}>
												{format(
													new Date(groupInfo.createdAt),
													"MMMM d, yyyy",
												)}
											</time>
										</dd>
									</div>
									<div className="flex justify-between gap-x-4 py-3">
										<dt className="text-gray-500 dark:text-gray-400">
											Members
										</dt>
										<dd className="flex items-start gap-x-2">
											<div className="text-gray-700 dark:text-gray-400">
												{groupInfo.groupMemberCount}
											</div>
										</dd>
									</div>
									{groupInfo.creatorId === user?.id && (
										<div className="flex justify-between gap-x-4 py-3">
											<dt className="text-gray-500 dark:text-gray-400">
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
									{!createPostRouteMatch && groupInfo.isMember && (
										<ButtonLink to={ROUTES.GROUP.CREATE_POST}>
											Create Post
										</ButtonLink>
									)}
								</dl>
							</SideSectionWrapper>
						</Fragment>
					)}
					{/* info sidebar */}
				</div>
			</div>
		</div>
	);
};

export default GroupLayout;

import { Link } from "react-router-dom";
import { useRef } from "react";
import { MessageSquare } from "lucide-react";
import GroupInfo from "@/models/GroupInfo.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import EditorOutput from "@/components/EditorOutput.tsx";
import ReactionType from "@/models/enums/ReactionType.ts";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";
import PostReactions from "@/components/PostReactions.tsx";
import { clsx } from "clsx";
import useRelativeRouteMatch from "@/hooks/useRelativeRouteMatch.tsx";
import ROUTES from "@/constants/Routes.ts";

type PostProps = {
	post: ExtendedPost;
	likeCount: number;
	unlikeCount: number;
	commentCount: number;
	groupInfo: Omit<GroupInfo, "groupMemberCount" | "isMember" | "creatorId">;
	ownReaction?: ReactionType;
};

const Post = (props: PostProps) => {
	const { commentCount, likeCount, unlikeCount, post, ownReaction, groupInfo } = props;
	const paragraphBlurRef = useRef<HTMLParagraphElement>(null);
	const isHomeFeed = useRelativeRouteMatch(ROUTES.HOME);

	return (
		<div className="rounded-md bg-white shadow">
			<div className="px-6 py-4 flex justify-between">
				{/*<PostVoteClient*/}
				{/*	postId={post.id}*/}
				{/*	initialVotesAmt={_votesAmt}*/}
				{/*	initialVote={_currentVote?.type}*/}
				{/*/>*/}

				<div className="w-0 flex-1">
					<div className="max-h-40 mt-1 text-xs text-gray-500">
						<Link
							to={`/group/${groupInfo.id}`}
							className="underline text-zinc-900 text-sm underline-offset-2"
						>
							{groupInfo.title}
						</Link>
						<span className="px-1">•</span>
						<span>Posted by {post.creator.username}</span>{" "}
						{formatTimeToNow(new Date(post.createdAt))}
					</div>
					<Link
						// href={`/r/${subredditName}/post/${post.id}`}
						to={
							!!isHomeFeed
								? `/group/${groupInfo.id}/post/${post.id}`
								: `post/${post.id}`
						}
					>
						<h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
							{post.title}
						</h1>
					</Link>

					<div
						className="relative text-sm max-h-40 w-full overflow-clip"
						ref={paragraphBlurRef}
					>
						<EditorOutput postContent={JSON.parse(post.content)} />
						{paragraphBlurRef.current?.clientHeight === 160 ? (
							// blur bottom if content is too long
							<div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
						) : null}
					</div>
				</div>
			</div>

			<div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6 flex items-center gap-3">
				<PostReactions
					postId={post.id}
					likeCount={likeCount}
					unlikeCount={unlikeCount}
					ownReaction={ownReaction}
				/>
				<Link
					to={"/"}
					// href={`/r/${subredditName}/post/${post.id}`}
					className="w-fit flex items-center gap-2"
				>
					<MessageSquare
						className={clsx(
							"h-4 w-4 hover:text-teal-500 hover:scale-125 transform transition duration-100",
						)}
					/>{" "}
					{commentCount} {/*{commentCount === 1 ? "comment" : "comments"}*/}
				</Link>
			</div>
		</div>
	);
};

export default Post;

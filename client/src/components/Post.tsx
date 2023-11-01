import { Link } from "react-router-dom";
import { Fragment, useRef } from "react";
import ROUTES from "@/constants/Routes.ts";
import GroupInfo from "@/models/GroupInfo.ts";
import ExtendedPost from "@/models/ExtendedPost.ts";
import ReactionType from "@/models/enums/ReactionType.ts";
import { formatTimeToNow } from "@/utils/DateFormatters.ts";

type PostProps = {
	post: ExtendedPost;
	likeCount: number;
	unlikeCount: number;
	commentCount: number;
	groupInfo?: GroupInfo;
	ownReaction?: ReactionType;
};

const Post = (props: PostProps) => {
	const { commentCount, likeCount, unlikeCount, post, ownReaction, groupInfo } = props;

	const paragraphBlurRef = useRef<HTMLParagraphElement>(null);

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
						{groupInfo && (
							<Fragment>
								<Link
									to={ROUTES.GROUP.BASE}
									className="underline text-zinc-900 text-sm underline-offset-2"
								>
									{groupInfo.title}
								</Link>
								<span className="px-1">•</span>
							</Fragment>
						)}
						<span>Posted by {post.creator.username}</span>{" "}
						{formatTimeToNow(new Date(post.createdAt))}
					</div>
					<Link
						// href={`/r/${subredditName}/post/${post.id}`}
						to={"/"}
					>
						<h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
							{post.title}
						</h1>
					</Link>

					<div
						className="relative text-sm max-h-40 w-full overflow-clip"
						ref={paragraphBlurRef}
					>
						{/*<EditorOutput content={post.content} />*/}
						{paragraphBlurRef.current?.clientHeight >= 160 ? (
							// blur bottom if content is too long
							<div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
						) : null}
					</div>
				</div>
			</div>

			<div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
				<Link
					to={"/"}
					// href={`/r/${subredditName}/post/${post.id}`}
					className="w-fit flex items-center gap-2"
				>
					{/*<MessageSquare className="h-4 w-4" /> {commentAmt} comments*/}
				</Link>
			</div>
		</div>
	);
};

export default Post;

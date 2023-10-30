import Group from "@/models/Group.ts";
import Editor from "@/components/Editor.tsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useGroupContext } from "@/context/GroupContext.tsx";

const CreatePost = () => {
	const { group } = useGroupContext();

	return (
		<div className="flex flex-col items-start gap-6">
			{/* heading */}
			<div className="border-b border-gray-200 pb-5">
				<div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
					<h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
						Create Post
					</h3>
					{group === Group.EMPTY ? (
						<Skeleton></Skeleton>
					) : (
						<p className="ml-2 truncate text-sm text-gray-500">in {group.title}</p>
					)}
				</div>
			</div>
			{/* form */}
			<Editor />

			<div className="w-full flex justify-end">
				<Button type="submit" className="w-full" form="subreddit-post-form">
					Post
				</Button>
			</div>
		</div>
	);
};

export default CreatePost;

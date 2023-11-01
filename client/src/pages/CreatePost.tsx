import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import handleError from "@/utils/handleError.ts";
import CreatePostEditor from "@/components/CreatePostEditor.tsx";
import useFetchGroupDetails from "@/hooks/group/useFetchGroupDetails.tsx";

const CreatePost = () => {
	const params = useParams<"slug">();
	const {
		data: group,
		isFetching: fetchingGroup,
		isError: fetchGroupIsError,
		error: fetchGroupError,
	} = useFetchGroupDetails(params.slug!);

	if (fetchGroupIsError) {
		handleError(fetchGroupError);
	}

	return fetchingGroup ? (
		<div>Loading...</div>
	) : (
		<div className="flex flex-col items-start gap-6">
			{/* heading */}
			<div className="border-b border-gray-200 pb-5">
				<div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
					<h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
						Create Post
					</h3>
					<p className="ml-2 truncate text-sm text-gray-500">in {group.title}</p>
				</div>
			</div>
			{/* form */}
			<CreatePostEditor groupSlug={group.id} />

			<div className="w-full flex justify-end">
				<Button type="submit" className="w-full" form="subreddit-post-form">
					Post
				</Button>
			</div>
		</div>
	);
};

export default CreatePost;

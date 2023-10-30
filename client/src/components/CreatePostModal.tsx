import { Button } from "@/components/ui/button.tsx";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import CreatePostEditor from "@/components/CreatePostEditor.tsx";

interface CreatePostModalProps {
	groupTitle: string;
}

const CreatePostModal = (props: CreatePostModalProps) => {
	const { groupTitle } = props;
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle className="flex flex-wrap items-baseline">
					Create Post
					<p className="ml-2 mt-1 truncate text-sm text-gray-400">in {groupTitle}</p>
				</DialogTitle>
				{/*<DialogDescription>*/}
				{/*	This action cannot be undone. This will permanently delete your account and*/}
				{/*	remove your data from our servers.*/}
				{/*</DialogDescription>*/}
			</DialogHeader>
			<div className="flex flex-col items-start gap-6">
				{/* form */}
				<CreatePostEditor />

				<div className="w-full flex justify-end">
					<Button type="submit" className="w-full" form="subreddit-post-form">
						Post
					</Button>
				</div>
			</div>
		</DialogContent>
	);
};

export default CreatePostModal;

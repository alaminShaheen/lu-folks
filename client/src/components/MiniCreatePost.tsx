import { useCallback } from "react";
import { Image, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const MiniCreatePost = () => {
	const { user } = useAppContext();
	const navigate = useNavigate();

	const navigateToCreatePost = useCallback(() => {
		navigate("/");
	}, [navigate]);

	return (
		<li className="overflow-hidden rounded-md bg-white shadow list-none">
			<div className="h-full px-6 py-4 flex justify-between gap-6">
				<div className="relative">
					{user && <UserAvatar imageUrl={user?.imageUrl} username={user?.username} />}

					<span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
				</div>

				<Input
					className="cursor-pointer"
					focusVisibleClass="focus-visible:outline-none focus-visible:ring-2"
					onClick={navigateToCreatePost}
					readOnly
					placeholder="Create post"
				/>
				<Button onClick={navigateToCreatePost} variant="ghost" className="px-0">
					<Image className="text-zinc-600" size={24} />
				</Button>
				<Button onClick={navigateToCreatePost} variant="ghost" className="px-0">
					<LinkIcon className="text-zinc-600" size={24} />
				</Button>
			</div>
		</li>
	);
};

export default MiniCreatePost;

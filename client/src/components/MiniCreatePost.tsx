import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Link as LinkIcon } from "lucide-react";
import ROUTES from "@/constants/Routes.ts";
import { Input } from "@/components/ui/input.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import { useAppContext } from "@/context/AppContext.tsx";

const MiniCreatePost = () => {
	const { user } = useAppContext();
	const navigate = useNavigate();

	const goToCreatePost = useCallback(() => {
		navigate(ROUTES.GROUP.CREATE_POST);
	}, [navigate]);

	return (
		<li className="overflow-hidden rounded-md bg-white dark:bg-secondary shadow list-none">
			<div className="h-full px-6 py-4 flex justify-between gap-6 items-center">
				<div className="relative">
					{user && <UserAvatar imageUrl={user?.imageUrl} username={user?.username} />}

					<span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white dark:outline-black" />
				</div>
				<Input
					onClick={goToCreatePost}
					readOnly
					placeholder="Create post"
					className="cursor-pointer"
				/>
				<ButtonLink to={ROUTES.GROUP.CREATE_POST} buttonClass="my-0" variant="ghost">
					<Image className="text-zinc-600 dark:text-zinc-400" size={20} />
				</ButtonLink>
				<ButtonLink to={ROUTES.GROUP.CREATE_POST} buttonClass="my-0" variant="ghost">
					<LinkIcon className="text-zinc-600 dark:text-zinc-400" size={20} />
				</ButtonLink>
			</div>
		</li>
	);
};

export default MiniCreatePost;

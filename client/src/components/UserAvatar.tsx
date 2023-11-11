import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { cn } from "@/lib/utils.ts";

interface UserAvatarProps {
	imageUrl?: string;
	username: string;
	className?: string;
}

const UserAvatar = (props: UserAvatarProps) => {
	const { imageUrl, username, className } = props;
	return (
		<Avatar className={cn(className, "border border-amber-200")}>
			<AvatarImage src={imageUrl} />
			<AvatarFallback className="bg-amber-200 text-gray-600">
				{username[0].toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;

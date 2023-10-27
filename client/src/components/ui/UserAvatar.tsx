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
		<Avatar className={cn(className, "")}>
			<AvatarImage src={imageUrl} />
			<AvatarFallback>{username}</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;

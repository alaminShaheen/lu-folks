import { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils.ts";

interface AppLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
	size?: number;
}

const AppLogo = (props: AppLogoProps) => {
	const { size = 11, className, ...rest } = props;
	return (
		<img
			className={cn(className, `h-${size} w-${size}`)}
			src="/logo-transparent-svg.svg"
			alt="app logo"
			{...rest}
		/>
	);
};

export default AppLogo;

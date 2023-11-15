import { Shell } from "lucide-react";
import { cn } from "../lib/utils.ts";

type LoadingSpinnerProps = {
	className?: string;
};

const LoadingSpinner = (props: LoadingSpinnerProps) => {
	const { className } = props;
	return <Shell className={cn("h-4 w-4 animate-spin", className && className)} />;
};

export default LoadingSpinner;

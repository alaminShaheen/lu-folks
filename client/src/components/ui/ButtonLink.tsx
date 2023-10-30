import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { Link, LinkProps } from "react-router-dom";
import { ReactNode } from "react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";

interface ButtonLinkProps extends LinkProps, VariantProps<typeof buttonVariants> {
	children: ReactNode;
	buttonClass?: string;
}

const ButtonLink = (props: ButtonLinkProps) => {
	const { children, variant, buttonClass, ...rest } = props;
	return (
		<Link {...rest}>
			<Button tabIndex={-1} className={cn("w-full mt-4 mb-6", buttonClass)} variant={variant}>
				{children}
			</Button>
		</Link>
	);
};

export default ButtonLink;

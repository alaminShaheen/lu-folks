import { Button } from "@/components/ui/button.tsx";
import { Link, LinkProps } from "react-router-dom";
import { ReactNode } from "react";

interface ButtonLinkProps extends LinkProps {
	children: ReactNode;
}

const ButtonLink = (props: ButtonLinkProps) => {
	const { children, ...rest } = props;
	return (
		<Link {...rest}>
			<Button tabIndex={-1} className="w-full mt-4 mb-6">
				{children}
			</Button>
		</Link>
	);
};

export default ButtonLink;

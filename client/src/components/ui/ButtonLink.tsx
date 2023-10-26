import { Button } from "@/components/ui/button.tsx";
import { Link, LinkProps } from "react-router-dom";

interface ButtonLinkProps extends LinkProps {}

const ButtonLink = (props: ButtonLinkProps) => {
	const { ...rest } = props;
	return (
		<Link {...rest}>
			<Button tabIndex={-1} className="w-full mt-4 mb-6">
				Create Community
			</Button>
		</Link>
	);
};

export default ButtonLink;

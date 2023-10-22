import React, { forwardRef, ReactNode } from "react";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";

export interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon: ReactNode;
	wrapperClassName?: string;
}

const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>((props, ref) => {
	const { icon, wrapperClassName, ...rest } = props;
	return (
		<span className={cn("relative", wrapperClassName)}>
			<span className="absolute top-1/2 transform -translate-y-1/2 right-3">{icon}</span>
			<Input {...rest} ref={ref} className={cn(rest.className, "pr-8")} />
		</span>
	);
});

export default InputWithIcon;

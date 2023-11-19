import { ReactNode } from "react";

type SideSectionWrapperProps = {
	title: string;
	icon?: ReactNode;
	description?: string;
	children: ReactNode;
};

const SideSectionWrapper = (props: SideSectionWrapperProps) => {
	const { children, description, title, icon } = props;
	return (
		<div className="overflow-hidden h-fit rounded-lg border border-gray-200 dark:border-gray-500 order-first md:order-last">
			<div className="bg-emerald-100 dark:bg-background px-6 py-4">
				<p className="font-semibold py-3 flex items-center gap-1.5">
					{icon && icon}
					{title}
				</p>
			</div>
			<dl className="-my-3 divide-y divide-gray-100 dark:divide-gray-500 bg-secondary px-6 py-4 text-sm leading-6">
				{description && (
					<div className="flex justify-between gap-x-4 py-3">
						<p className="text-zinc-500 dark:text-zinc-400">{description}</p>
					</div>
				)}
				{children}
			</dl>
		</div>
	);
};

export default SideSectionWrapper;

import { Users2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import useGroupSuggestion from "@/hooks/group/useGroupSuggestion.tsx";
import { useEffect, useRef } from "react";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import { useIntersection } from "@mantine/hooks";

const SuggestedGroupsList = () => {
	const { data: paginatedSuggestedGroup, fetchNextPage } = useGroupSuggestion();
	const lastGroupSuggestionContainerRef = useRef<HTMLLIElement>(null);
	const { ref: lastGroupSuggestionRef, entry } = useIntersection({
		root: lastGroupSuggestionContainerRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			void fetchNextPage(); // Load more posts when the last post comes into view
		}
	}, [entry, fetchNextPage]);

	const groupSuggestions =
		paginatedSuggestedGroup?.pages.flatMap((groupSuggestions) => groupSuggestions.data) ?? [];

	return (
		<ul className="list-none py-4 overflow-y-auto max-h-[400px] px-6">
			{groupSuggestions.map((groupSuggestion, index) => (
				<li
					className="flex items-center justify-between border-b"
					ref={index === groupSuggestions.length - 1 ? lastGroupSuggestionRef : undefined}
					key={groupSuggestion.id}
				>
					<div className="flex items-center gap-4">
						<Users2 className="h-5 w-5 dark:text-zinc-400 hidden md:block" />
						<div>
							<Link
								to={`/group/${groupSuggestion.id}`}
								className="font-bold text-blue-500 dark:text-blue-400 text-sm truncate"
							>
								{groupSuggestion.title}
							</Link>
							<p className="text-xs text-zinc-500 dark:text-zinc-400">
								{groupSuggestion.groupMemberCount}{" "}
								{groupSuggestion.groupMemberCount > 1 ? "users" : "user"}
							</p>
						</div>
					</div>
					<ButtonLink
						to={`/group/${groupSuggestion.id}`}
						buttonClass={cn(buttonVariants({ size: "sm" }), "my-4")}
						className="hidden lg:block"
					>
						Visit Group
					</ButtonLink>
				</li>
			))}
		</ul>
	);
};

export default SuggestedGroupsList;

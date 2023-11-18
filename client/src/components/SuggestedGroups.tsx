import { Users, Users2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import useGroupSuggestion from "@/hooks/group/useGroupSuggestion.tsx";
import { useEffect, useRef } from "react";
import ButtonLink from "@/components/ui/ButtonLink.tsx";
import { useIntersection } from "@mantine/hooks";

const SuggestedGroups = () => {
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
		<div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
			<div className="bg-emerald-100 px-6 py-4">
				<p className="font-semibold py-3 flex items-center gap-1.5">
					<Users className="h-4 w-4" />
					Suggested Groups
				</p>
			</div>
			<dl className="-my-3 divide-y divide-gray-100 py-4 text-sm leading-6">
				<div className="flex justify-between gap-x-4 py-3 px-6">
					<p className="text-zinc-500">
						Connect with users and posts of new groups here.
					</p>
				</div>
				<ul className="list-none py-4 overflow-y-auto max-h-[400px] px-6">
					{groupSuggestions.map((groupSuggestion, index) => (
						<li
							className="flex items-center justify-between border-b"
							ref={
								index === groupSuggestions.length - 1
									? lastGroupSuggestionRef
									: undefined
							}
							key={groupSuggestion.id}
						>
							<div className="flex items-center gap-4">
								<span>
									<Users2 className="h-5 w-5" />
								</span>
								<div>
									<Link
										to={`/group/${groupSuggestion.id}`}
										className="font-bold text-blue-500 text-sm"
									>
										{groupSuggestion.title}
									</Link>
									<p className="text-xs">
										{groupSuggestion.groupMemberCount}{" "}
										{groupSuggestion.groupMemberCount > 1 ? "users" : "user"}
									</p>
								</div>
							</div>
							<ButtonLink
								to={`/group/${groupSuggestion.id}`}
								buttonClass={cn(buttonVariants({ size: "sm" }), "my-4")}
							>
								Visit Group
							</ButtonLink>
						</li>
					))}
				</ul>
			</dl>
		</div>
	);
};

export default SuggestedGroups;

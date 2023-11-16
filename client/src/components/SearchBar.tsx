import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command.tsx";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import useSearchGroups from "@/hooks/search/useSearchGroups.tsx";
import { useNavigate } from "react-router-dom";
import { ScrollText, User2, Users } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside.tsx";

const SearchBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const commandRef = useRef<HTMLDivElement>(null);
	const { data: searchResults, isFetched, refetch } = useSearchGroups({ searchTerm });
	const navigate = useNavigate();
	useOnClickOutside(commandRef, () => {
		setSearchTerm("");
	});

	const request = debounce(async () => {
		await refetch();
	}, 300);

	const debounceRequest = useCallback(() => {
		request();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {}, []);

	return (
		<Command
			ref={commandRef}
			className="relative rounded-lg border max-w-lg z-50 overflow-visible"
		>
			<CommandInput
				value={searchTerm}
				onValueChange={(e) => {
					setSearchTerm(e);
					debounceRequest();
				}}
				className="outline-none border-none focus:border-none focus:outline-none ring-0"
				placeholder="Search groups, posts & users..."
			/>

			{searchTerm.length > 0 && (
				<CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
					{isFetched && <CommandEmpty>No results found.</CommandEmpty>}
					{((searchResults?.groups.length ||
						searchResults?.posts.length ||
						searchResults?.users.length) ??
						0) > 0 ? (
						<Fragment>
							<CommandGroup heading="Groups">
								{searchResults?.groups.map((group) => {
									return (
										<CommandItem
											onSelect={() => {
												navigate(`/group/${group.id}`);
												setSearchTerm("");
												// router.refresh()
											}}
											key={group.id}
											value={group.title}
										>
											<Users className="mr-2 h-4 w-4" />
											{group.title}
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandGroup heading="Posts">
								{searchResults?.posts.map((post) => {
									return (
										<CommandItem
											onSelect={() => {
												navigate(`post/${post.id}`);
												setSearchTerm("");
												// router.refresh()
											}}
											key={post.id}
											value={post.title}
										>
											{/*<Users className='mr-2 h-4 w-4' />*/}
											<ScrollText className="mr-2 h-4 w-4" />
											{post.title}
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandGroup heading="Users">
								{searchResults?.users.map((user) => {
									return (
										<CommandItem
											onSelect={() => {
												navigate(`/group/${user.id}`);
												setSearchTerm("");
												// router.refresh()
											}}
											key={user.id}
											value={user.username}
										>
											<User2 className="mr-2 h-4 w-4" />
											{user.username}
										</CommandItem>
									);
								})}
							</CommandGroup>
						</Fragment>
					) : null}
				</CommandList>
			)}
		</Command>
	);
};

export default SearchBar;

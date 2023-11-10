import { Skeleton } from "@/components/ui/skeleton.tsx";

const ListPostSkeleton = () => {
	return (
		<li>
			<div className="rounded-md bg-white shadow">
				<div className="px-6 py-4 flex justify-between flex-col">
					<div className="w-full">
						<Skeleton className="rounded h-4 w-2/5 mb-3" />
						<Skeleton className="rounded h-4 w-1/4 mb-3" />
						<Skeleton className="rounded h-16 w-full" />
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-4 sm:px-6 flex items-center gap-3">
					<Skeleton className="rounded h-4 w-10 mb-3" />
					<Skeleton className="rounded h-4 w-10 mb-3" />
					<Skeleton className="rounded h-4 w-10 mb-3" />
				</div>
			</div>
		</li>
	);
};

export default ListPostSkeleton;

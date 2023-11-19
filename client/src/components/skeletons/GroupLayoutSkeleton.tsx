import { Skeleton } from "@/components/ui/skeleton.tsx";

const GroupLayoutSkeleton = () => {
	return (
		<div className="overflow-hidden h-fit rounded-lg border border-gray-200 dark:border-gray-500 order-first md:order-last">
			<div className="px-6 py-4">
				<Skeleton className="rounded h-5 w-2/3" />
			</div>
			<dl className="divide-y divide-gray-100 dark:divide-gray-400 px-6 py-4 text-sm leading-6">
				<div className="flex justify-between gap-x-4 py-3">
					<Skeleton className="rounded h-3 w-1/4" />
					<dd className="text-gray-700 dark:text-gray-400">
						<Skeleton className="rounded h-3 w-20" />
					</dd>
				</div>
				<div className="flex justify-between gap-x-4 py-3">
					<Skeleton className="rounded h-3 w-1/4" />
					<dd className="flex items-start gap-x-2">
						<Skeleton className="rounded h-3 w-20" />
					</dd>
				</div>
				<div className="flex flex-col justify-between gap-y-4 py-3">
					<Skeleton className="rounded h-3 w-1/2" />
					<Skeleton className="rounded h-3 w-2/3" />
				</div>

				<Skeleton className="w-full h-10 my-5" />
				<Skeleton className="w-full h-10" />
			</dl>
		</div>
	);
};

export default GroupLayoutSkeleton;

import { ReactNode } from "react";
import Navbar from "@/components/NavBar.tsx";
import { cn } from "@/lib/utils.ts";

interface PageLayoutProps {
	children: ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
	const { children } = props;
	return (
		<div className={cn("bg-white text-slate-900 antialiased light")}>
			<div className="min-h-screen pt-12 bg-slate-50 antialiased">
				<Navbar />
				<div className="container max-w-7xl mx-auto h-full pt-12">{children}</div>
			</div>
		</div>
	);
};

export default PageLayout;

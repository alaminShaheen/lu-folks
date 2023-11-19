import { ReactNode } from "react";
import Navbar from "@/components/NavBar.tsx";
import { cn } from "@/lib/utils.ts";

interface PageLayoutProps {
	children: ReactNode;
}

const PageLayout = (props: PageLayoutProps) => {
	const { children } = props;
	// bg-slate-50
	return (
		<div className={cn("bg-white text-foreground antialiased")}>
			<div className="min-h-screen pt-12 antialiased bg-background">
				<Navbar />
				<div className="container max-w-7xl mx-auto h-full pt-12">{children}</div>
			</div>
		</div>
	);
};

export default PageLayout;

import { ReactNode } from "react";
import Navbar from "@/components/NavBar.tsx";
import { cn } from "@/lib/utils.ts";

interface LayoutProps {
	children: ReactNode;
}

const Layout = (props: LayoutProps) => {
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

export default Layout;

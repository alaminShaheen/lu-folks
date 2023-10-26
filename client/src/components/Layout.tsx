import { ReactNode } from "react";
import Navbar from "@/components/NavBar.tsx";

interface LayoutProps {
	children: ReactNode;
}

const Layout = (props: LayoutProps) => {
	const { children } = props;
	return (
		<div className="min-h-screen pt-20 bg-slate-100 antialiased">
			<Navbar />
			{children}
		</div>
	);
};

export default Layout;

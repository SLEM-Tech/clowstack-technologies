import { ReactNode } from "react";
import Header from "./Navbars/Header";
import Footer from "./Footers/Footer";

interface AppLayoutProps {
	children: ReactNode;
	className?: string;
}

const AppLayout = ({ children, className }: AppLayoutProps) => {
	return (
		<main className={`relative`}>
			<Header />
			{/*
			  pt offsets the fixed header:
			  mobile  ≈ 120 px  (logo row + search row)
			  desktop ≈ 155 px  (utility bar + main header + bottom nav)
			*/}
			<div className={`min-h-screen pt-[120px] slg:pt-[155px] ${className}`}>
				{children}
			</div>
			<Footer />
			<div className='mt-20 sm:mt-0' />
		</main>
	);
};

export default AppLayout;

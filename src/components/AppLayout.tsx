"use client";
import { ReactNode } from "react";
import Header from "./Navbars/Header";
import Footer from "./Footers/Footer";
import WishlistDrawer from "./Wishlist/WishlistDrawer";
import CompareBar from "./Compare/CompareBar";

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

			{/* Global UI — Wishlist drawer + Compare floating bar */}
			<WishlistDrawer />
			<CompareBar />
		</main>
	);
};

export default AppLayout;

"use client";
import React, { useMemo, useState, useTransition, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "react-use-cart";
import { useAppDispatch, useAppSelector } from "../hooks";
import Drawer from "rc-drawer";
import { useCustomer } from "../lib/woocommerce";
import { currencyOptions, filterCustomersByEmail } from "@constants";
import { getFirstCharacter, signOut } from "@utils/lib";
import Picture from "../picture/Picture";
import { APICall } from "@utils";
import { fetchExchangeRate } from "@utils/endpoints";
import { setBaseCurrency, setExchangeRate } from "../Redux/Currency";
import FormToast from "../Reusables/Toast/SigninToast";
import useToken from "../hooks/useToken";

import { Menu, Transition } from "@headlessui/react";
import {
	FiSearch,
	FiShoppingBag,
	FiUser,
	FiLogOut,
	FiMenu,
	FiShoppingCart,
	FiHeart,
} from "react-icons/fi";
import { SlArrowDown } from "react-icons/sl";
import Flag from "react-world-flags";
import GlobalLoader from "../modal/GlobalLoader";
import MobileNav from "./MobileNav";
import ProductTable from "../Tables/ProductTable";
import CategoryPageBottomHeader from "./CategoryPageBottomHeader";
import ProductPageBottomHeader from "./ProductPageBottomHeader";
import { FaCartArrowDown, FaFire, FaPhoneAlt } from "react-icons/fa";
import { BiUser, BiTransfer } from "react-icons/bi";
import { ImSpinner2 } from "@node_modules/react-icons/im";

const Header = () => {
	const pathname = usePathname();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { email } = useToken();
	const { totalItems } = useCart();

	const { baseCurrency } = useAppSelector((state) => state.currency);
	const [isPending, startTransition] = useTransition();

	const [isCartOpen, setIsCartOpen] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const [searchValue, setSearchValue] = useState("");

	const { data: customer } = useCustomer("");
	const wc_customer_info = useMemo(
		() => filterCustomersByEmail(customer as Woo_Customer_Type[], email),
		[customer, email],
	);

	const onOpenCart = () => setIsCartOpen(true);
	const onCloseCart = () => setIsCartOpen(false);

	const handleCurrencyChange = async (code: string) => {
		const selectedObj = currencyOptions.find((c) => c.code === code);
		if (!selectedObj) return;
		try {
			const data = await APICall(fetchExchangeRate, ["NGN", code], true, true);
			if (data) {
				dispatch(setExchangeRate(data));
				dispatch(setBaseCurrency(selectedObj));
				FormToast({ message: `Switched to ${code}`, success: true });
			}
		} catch (error) {
			FormToast({ message: "Currency switch failed", success: false });
		}
	};

	const handleSearch = () => {
		if (!searchValue) return;
		startTransition(() => {
			router.push(`/search?${searchValue}`);
		});
	};

	const userDropDownLinks = [
		{ id: 1, href: "/user/dashboard", icon: <BiUser />, label: "My Account" },
		{
			id: 2,
			href: "/user/my-orders",
			icon: <FaCartArrowDown />,
			label: "Orders",
		},
		{ id: 3, onClick: onOpenCart, icon: <FiShoppingCart />, label: "Cart" },
	];

	const isOnCategoryPage = pathname.includes("/category");
	const isOnProductPage = pathname.includes("/home-item");
	const isOnHomePage = !isOnCategoryPage && !isOnProductPage;

	const bottomNavLinks = [
		{ href: "/", text: "Home" },
		{ href: "/about", text: "About" },
		{ href: "/category", text: "Shop" },
		{ href: "/contact-us", text: "Contact" },
	];

	return (
		<>
			<header className='flex flex-col w-full z-[100] fixed top-0 shadow-sm transition-all'>
				{/* ── TOP UTILITY BAR (desktop only) ── */}
				<div className='hidden slg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-1.5 text-xs text-gray-500'>
					{/* Left quick links */}
					<div className='flex items-center divide-x divide-gray-200'>
						{[
							
							{ label: "My Account", href: "/user/dashboard" },
							{ label: "Wishlist", href: "/user/my-orders" },
						].map((item) => (
							<Link
								key={item.label}
								href={item.href}
								className='px-3 first:pl-0 hover:text-shop transition-colors'
							>
								{item.label}
							</Link>
						))}
					</div>

					{/* Center promo banner */}
					<span className='text-orange-500 font-medium hidden md:block'>
						110% Secure delivery without contacting the counter
					</span>

					{/* Right: help + language + currency */}
					<div className='flex items-center gap-3'>
						<span>
							Need help?{" "}
							<a
								href='tel:+23400980122'
								className='font-semibold text-gray-800 hover:text-shop transition-colors'
							>
								+23400980122
							</a>
						</span>
						<span className='text-gray-300'>|</span>
						<span className='cursor-pointer hover:text-shop transition-colors'>
							English
						</span>
						<span className='text-gray-300'>|</span>

						{/* Currency Dropdown */}
						<Menu as='div' className='relative inline-block text-left'>
							{({ open }) => (
								<>
									<Menu.Button className='flex items-center gap-1 cursor-pointer hover:text-shop outline-none transition-colors'>
										{/* @ts-ignore */}
										<Flag
											code={baseCurrency?.countryCode || "NG"}
											className='w-4 rounded-sm'
										/>
										<span className='font-semibold uppercase'>
											{baseCurrency.code}
										</span>
										<SlArrowDown
											className={`text-[8px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
										/>
									</Menu.Button>

									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<Menu.Items className='absolute right-0 mt-2 w-36 origin-top-right bg-white border border-gray-100 rounded-xl shadow-lg p-1 z-[110] outline-none'>
											{currencyOptions.map((c) => (
												<Menu.Item key={c.code}>
													{({ active }) => (
														<button
															onClick={() => handleCurrencyChange(c.code)}
															className={`${active ? "bg-gray-50 text-gray-900" : "text-gray-600"} flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors`}
														>
															{/* @ts-ignore */}
															<Flag code={c.countryCode} className='w-4' />
															{c.code} ({c.symbol})
														</button>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</>
							)}
						</Menu>
					</div>
				</div>

				{/* ── MAIN HEADER (desktop) ── */}
				<div className='hidden slg:flex items-center bg-white border-b border-gray-100 w-full'>
					<div className='max-w-[1440px] mx-auto w-full flex items-center gap-6 px-8 py-3'>
						{/* Logo */}
						<Link
							href='/'
							className='flex-shrink-0 w-36 text-2xl font-black text-gray-900 tracking-tight'
						>
							<span className='text-shop'>C</span>lowStack
						</Link>

						{/* Search bar */}
						<div className='flex flex-1'>
							<input
								type='text'
								placeholder='Search for products...'
								className='flex-1 h-10 text-sm border border-gray-300 border-r-0 rounded-l-sm px-4 outline-none focus:border-shop transition-colors bg-white'
								onChange={(e) => setSearchValue(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							/>
							<button
								onClick={handleSearch}
								className='bg-shop text-white px-6 h-10 text-sm font-medium rounded-r-sm hover:bg-shop-dark transition-colors flex items-center gap-2 shrink-0'
							>
								<FiSearch className='text-base' />
								Search
							</button>
						</div>

						{/* Action icons */}
						<div className='flex items-center gap-6'>
							{/* Compare */}
							<button className='flex flex-col items-center gap-0.5 group cursor-pointer'>
								<BiTransfer className='text-2xl text-gray-500 group-hover:text-shop transition-colors' />
								<span className='text-[10px] text-gray-400 group-hover:text-shop transition-colors'>
									Compare
								</span>
							</button>

							{/* Wishlist */}
							<button className='flex flex-col items-center gap-0.5 group cursor-pointer'>
								<FiHeart className='text-2xl text-gray-500 group-hover:text-shop transition-colors' />
								<span className='text-[10px] text-gray-400 group-hover:text-shop transition-colors'>
									Wishlist
								</span>
							</button>

							{/* Cart */}
							<button
								onClick={onOpenCart}
								className='flex flex-col items-center gap-0.5 group cursor-pointer'
							>
								<div className='relative'>
									<FiShoppingBag className='text-2xl text-gray-500 group-hover:text-shop transition-colors' />
									{totalItems > 0 && (
										<span className='absolute -top-2 -right-2 size-4 bg-shop text-white text-[9px] font-black flex items-center justify-center rounded-full'>
											{totalItems}
										</span>
									)}
								</div>
								<span className='text-[10px] text-gray-400 group-hover:text-shop transition-colors'>
									Cart
								</span>
							</button>

							{/* Account Dropdown */}
							<Menu as='div' className='relative inline-block text-left'>
								{({ open }) => (
									<>
										<Menu.Button className='flex flex-col items-center gap-0.5 group cursor-pointer outline-none'>
											{wc_customer_info?.shipping?.address_2 ? (
												<Picture
													src={wc_customer_info.shipping.address_2}
													alt='user'
													className='size-7 rounded-full border border-gray-200'
												/>
											) : (
												<FiUser className='text-2xl text-gray-500 group-hover:text-shop transition-colors' />
											)}
											<span className='text-[10px] text-gray-400 group-hover:text-shop transition-colors'>
												Account
											</span>
										</Menu.Button>

										<Transition
											as={Fragment}
											enter='transition ease-out duration-100'
											enterFrom='transform opacity-0 scale-95'
											enterTo='transform opacity-100 scale-100'
											leave='transition ease-in duration-75'
											leaveFrom='transform opacity-100 scale-100'
											leaveTo='transform opacity-0 scale-95'
										>
											<Menu.Items className='absolute right-0 mt-2 w-52 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-xl p-1.5 z-[110] outline-none'>
												{wc_customer_info?.first_name && (
													<div className='px-3 py-2 mb-1 border-b border-gray-100'>
														<p className='text-xs text-gray-400'>Logged in as</p>
														<p className='text-sm font-bold text-gray-900 truncate'>
															{wc_customer_info.first_name}
														</p>
													</div>
												)}
												{userDropDownLinks.map((item) => (
													<Menu.Item key={item.id}>
														{({ active }) => (
															<button
																onClick={(e) => {
																	if (item.onClick) {
																		e.preventDefault();
																		item.onClick();
																	} else if (item.href) {
																		router.push(item.href);
																	}
																}}
																className={`${active ? "bg-gray-50 text-gray-900" : "text-gray-600"} flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors`}
															>
																<span>{item.icon}</span>
																{item.label}
															</button>
														)}
													</Menu.Item>
												))}
												<Menu.Item>
													{({ active }) => (
														<button
															onClick={() => signOut()}
															className={`${active ? "bg-red-50" : ""} flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 font-semibold transition-colors mt-0.5`}
														>
															<FiLogOut /> Log Out
														</button>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</>
								)}
							</Menu>
						</div>
					</div>
				</div>

				{/* ── BOTTOM NAV (desktop, home / about / contact pages) ── */}
				{isOnHomePage && (
					<nav className='hidden slg:flex items-center bg-[#1a1a1a] w-full'>
						<div className='max-w-[1440px] mx-auto w-full flex items-center px-8 py-2 gap-6'>
							{/* Browse All Categories */}
							<Link
								href='/category'
								className='flex items-center gap-2 bg-shop text-white px-4 py-1.5 text-sm font-medium hover:bg-shop-dark transition-colors shrink-0'
							>
								<span className='text-base leading-none'>☰</span>
								Browse All Categories
								<SlArrowDown className='text-[9px]' />
							</Link>

							{/* Hot Deals */}
							<Link
								href='/category'
								className='flex items-center gap-1.5 text-sm font-medium text-white hover:text-shop transition-colors shrink-0'
							>
								<FaFire className='text-orange-400' />
								Hot Deals
							</Link>

							{/* Nav links */}
							{bottomNavLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className={`text-sm font-medium transition-colors ${
										pathname === link.href
											? "text-shop"
											: "text-gray-300 hover:text-white"
									}`}
								>
									{link.text}
									{(link.text === "Home" || link.text === "Shop") && (
										<SlArrowDown className='inline-block ml-0.5 text-[8px]' />
									)}
								</Link>
							))}

							<div className='flex-1' />

							{/* Phone */}
							<div className='flex items-center gap-2 text-white shrink-0'>
								<div className='size-8 rounded-full bg-shop flex items-center justify-center'>
									<FaPhoneAlt className='text-white text-sm' />
								</div>
								<div>
									<p className='text-[10px] text-gray-400'>24/7 Support Center</p>
									<p className='text-sm font-bold'>23400888123</p>
								</div>
							</div>
						</div>
					</nav>
				)}

				{/* Conditional sub-headers for category / product pages */}
				{isOnCategoryPage && <CategoryPageBottomHeader />}
				{isOnProductPage && <ProductPageBottomHeader />}

				{/* ── MOBILE HEADER ── */}
				<div className='slg:hidden flex flex-col w-full bg-white border-b border-gray-200'>
					<div className='flex items-center justify-between p-4 pb-2'>
						<div className='flex items-center gap-3'>
							<button onClick={() => setDrawerVisible(true)}>
								<FiMenu className='text-2xl text-gray-700' />
							</button>
							<Link
								href='/'
								className='text-xl font-black text-gray-900 tracking-tight'
							>
								<span className='text-shop'>C</span>lowStack
							</Link>
						</div>
						<button onClick={onOpenCart} className='relative'>
							<FiShoppingBag className='text-2xl text-gray-700' />
							{totalItems > 0 && (
								<span className='absolute -top-2 -right-2 size-4 bg-shop rounded-full text-[9px] flex items-center justify-center text-white font-bold'>
									{totalItems}
								</span>
							)}
						</button>
					</div>
					<div className='flex px-4 pb-3'>
						<input
							type='text'
							placeholder='Search for products...'
							className='flex-1 h-10 text-sm border border-gray-300 border-r-0 rounded-l-sm px-4 outline-none focus:border-shop'
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						/>
						<button
							onClick={handleSearch}
							className='bg-shop text-white px-4 h-10 text-sm font-medium rounded-r-sm hover:bg-shop-dark transition-colors flex items-center justify-center min-w-[70px]'
						>
							{isPending ? (
								<ImSpinner2 className='animate-spin' />
							) : (
								"Search"
							)}
						</button>
					</div>
				</div>
			</header>

			{/* Cart Drawer */}
			<Drawer
				open={isCartOpen}
				onClose={onCloseCart}
				placement='right'
				width={
					typeof window !== "undefined" && window.innerWidth > 768 ? 500 : "100%"
				}
			>
				<ProductTable onClose={onCloseCart} />
			</Drawer>

			<GlobalLoader isPending={isPending} />
			<MobileNav
				closeDrawer={() => setDrawerVisible(false)}
				drawerVisible={drawerVisible}
			/>
		</>
	);
};

export default Header;

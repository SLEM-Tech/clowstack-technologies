"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { signOut } from "@utils/lib";
import { CompanyName, filterCustomersByEmail } from "@constants";
import { useCustomer } from "../lib/woocommerce";
import useToken from "../hooks/useToken";
import { usePathname } from "next/navigation";
import {
	BiLogoFacebook,
	BiLogoInstagram,
	BiLogoTwitter,
	BiLogoWhatsapp,
} from "react-icons/bi";
import { FaHeadphones } from "react-icons/fa";

const Footer = () => {
	const { email } = useToken();
	const currentYear = new Date().getFullYear();
	const pathname = usePathname();

	const { data: customer } = useCustomer("");
	const wc_customer_info: Woo_Customer_Type | undefined = useMemo(
		() => filterCustomersByEmail(customer as Woo_Customer_Type[], email),
		[customer, email],
	);

	const firstName = wc_customer_info?.first_name;

	const companyLinks = [
		{ label: "Privacy Policy", href: "/terms-of-use?privacy-policy" },
		{ label: "Terms & Conditions", href: "/terms-of-use?terms-of-use" },
		{ label: "Contact Us", href: "/contact-us" },
		{ label: "Support Center", href: "/contact-us" },
		{ label: "FAQs", href: "/faq" },
	];

	const accountLinks = [
		{
			label: firstName ? "My Account" : "Sign In",
			href: firstName ? "/user/dashboard" : "/user/login",
		},
		{ label: "View Cart", href: "/cart" },
		{ label: "My Wishlist", href: "/user/my-orders" },
	];

	const socialLinks = [
		{ icon: <BiLogoFacebook />, href: "#", bg: "bg-blue-600" },
		{ icon: <BiLogoTwitter />, href: "#", bg: "bg-sky-500" },
		{ icon: <BiLogoInstagram />, href: "#", bg: "bg-pink-600" },
		{ icon: <BiLogoWhatsapp />, href: "#", bg: "bg-whatsapp" },
	];

	return (
		<footer className='bg-white border-t border-gray-200 w-full'>
			{/* ── Main footer columns ── */}
			<div className='max-w-[1440px] mx-auto px-4 sm:px-8 py-10 grid grid-cols-2 md:grid-cols-3 gap-8'>
				{/* Column 1 – Logo + tagline + social */}
				<div className='col-span-2 md:col-span-1 space-y-4'>
					<Link
						href='/'
						className='text-2xl font-black text-gray-900 tracking-tight inline-block'
					>
						<span className='text-shop'>C</span>lowStack
					</Link>
					<p className='text-sm text-gray-500 leading-relaxed'>
						Your trusted destination for quality tech accessories and electronics
						delivered nationwide.
					</p>
					<div className='flex items-center gap-2'>
						{socialLinks.map((s, i) => (
							<a
								key={i}
								href={s.href}
								className={`${s.bg} text-white size-8 rounded-full flex items-center justify-center text-base hover:opacity-80 transition-opacity`}
							>
								{s.icon}
							</a>
						))}
					</div>

					{/* Payment logos */}
					<div>
						<p className='text-xs text-gray-500 mb-2 font-medium'>
							Secured Payment Gateways
						</p>
						<div className='flex items-center gap-2 flex-wrap'>
							<img src='/images/visa.png' alt='Visa' className='h-6 object-contain' />
							<img src='/images/mastercard.png' alt='Mastercard' className='h-6 object-contain' />
							<img src='/images/maestro.png' alt='Maestro' className='h-6 object-contain' />
						</div>
					</div>
				</div>

				{/* Column 2 – Company links */}
				<div className='space-y-3'>
					<h3 className='text-sm font-bold text-gray-900 uppercase tracking-wide'>
						Company
					</h3>
					{companyLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={`block text-sm transition-colors leading-relaxed ${
								pathname === link.href
									? "text-shop font-medium"
									: "text-gray-500 hover:text-shop"
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Column 3 – Account links */}
				<div className='space-y-3'>
					<h3 className='text-sm font-bold text-gray-900 uppercase tracking-wide'>
						Account
					</h3>
					{accountLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={`block text-sm transition-colors leading-relaxed ${
								pathname === link.href
									? "text-shop font-medium"
									: "text-gray-500 hover:text-shop"
							}`}
						>
							{link.label}
						</Link>
					))}
					{firstName && (
						<button
							onClick={signOut}
							className='block text-sm text-red-500 hover:text-red-700 transition-colors text-left'
						>
							Log Out
						</button>
					)}
				</div>
			</div>

			{/* ── Bottom bar ── */}
			<div className='border-t border-gray-100'>
				<div className='max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
					{/* Copyright */}
					<p className='text-xs text-gray-500 text-center sm:text-left'>
						&copy; {currentYear} {CompanyName}. All rights reserved.
					</p>

					{/* Phone numbers */}
					<div className='flex items-center gap-6'>
						<div className='flex items-center gap-2'>
							<div className='size-7 bg-shop-light rounded-full flex items-center justify-center shrink-0'>
								<FaHeadphones className='text-shop text-xs' />
							</div>
							<div>
								<p className='text-[9px] text-gray-400 leading-none'>
									Working 8:00 – 22:00
								</p>
								<a
									href='tel:+23400646666'
									className='text-xs font-semibold text-gray-800 hover:text-shop transition-colors'
								>
									+23400646666
								</a>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<div className='size-7 bg-shop-light rounded-full flex items-center justify-center shrink-0'>
								<FaHeadphones className='text-shop text-xs' />
							</div>
							<div>
								<p className='text-[9px] text-gray-400 leading-none'>
									24/7 Support
								</p>
								<a
									href='tel:+23400648888'
									className='text-xs font-semibold text-gray-800 hover:text-shop transition-colors'
								>
									+23400648888
								</a>
							</div>
						</div>
					</div>

					{/* Follow us */}
					<div className='flex items-center gap-2'>
						<span className='text-xs text-gray-500 font-medium'>Follow Us</span>
						{socialLinks.map((s, i) => (
							<a
								key={i}
								href={s.href}
								className={`${s.bg} text-white size-6 rounded-full flex items-center justify-center text-xs hover:opacity-80 transition-opacity`}
							>
								{s.icon}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

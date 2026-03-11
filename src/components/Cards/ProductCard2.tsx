"use client";

import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { RiShoppingBagFill } from "react-icons/ri";
import { FiHeart, FiBarChart2 } from "react-icons/fi";
import { useCart } from "react-use-cart";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Picture from "../picture/Picture";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { convertToSlug } from "@constants";
import { RootState } from "../set-up/redux/root-reducer";
import { toggleWishlist } from "../Redux/Wishlist";
import { toggleCompare } from "../Redux/Compare";

interface ProductCard2Props {
	id: string | number;
	image: string;
	oldAmount?: string;
	newAmount: string;
	description: string;
	boxShadow?: boolean;
	product?: ProductType;
}

const ProductCard2 = ({
	id,
	image,
	oldAmount,
	newAmount,
	description,
	boxShadow = true,
	product,
}: ProductCard2Props) => {
	const dispatch = useDispatch();
	const { addItem, removeItem, updateItem, getItem } = useCart();

	const ID = id.toString();
	const cartItem = getItem(ID);
	const quantity = cartItem?.quantity || 0;
	const price = parseInt(newAmount);
	const slugDesc = convertToSlug(description);

	const wishlisted = useSelector((state: RootState) =>
		product ? state.wishlist.items.some((i) => i.id === product.id) : false,
	);
	const inCompare = useSelector((state: RootState) =>
		product ? state.compare.items.some((i) => i.id === product.id) : false,
	);
	const compareCount = useSelector((state: RootState) => state.compare.items.length);

	// Calculate Discount Percentage
	const discount = oldAmount
		? Math.round(((parseInt(oldAmount) - price) / parseInt(oldAmount)) * 100)
		: 0;

	const addToCart = () => {
		addItem({ id: ID, name: description, price, quantity: 1, image });
	};

	const increase = () => updateItem(ID, { quantity: quantity + 1 });
	const decrease = () => {
		if (quantity <= 1) removeItem(ID);
		else updateItem(ID, { quantity: quantity - 1 });
	};

	const handleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		if (product) dispatch(toggleWishlist(product));
	};

	const handleCompare = (e: React.MouseEvent) => {
		e.preventDefault();
		if (!product) return;
		if (!inCompare && compareCount >= 4) return;
		dispatch(toggleCompare(product));
	};

	return (
		<div
			className={`group relative flex flex-col rounded-2xl bg-white transition-all duration-500 hover:-translate-y-2 ${
				boxShadow
					? "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
					: "border border-gray-100"
			}`}
		>
			{/* Wishlist & Compare — appear on hover */}
			{product && (
				<div className='absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20'>
					<button
						onClick={handleWishlist}
						title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
						className={`p-1.5 rounded-full shadow transition ${
							wishlisted
								? "bg-red-500 text-white"
								: "bg-white text-slate-400 hover:text-red-500"
						}`}
					>
						<FiHeart size={14} className={wishlisted ? "fill-white" : ""} />
					</button>
					<button
						onClick={handleCompare}
						title={inCompare ? "Remove from compare" : "Add to compare"}
						disabled={!inCompare && compareCount >= 4}
						className={`p-1.5 rounded-full shadow transition disabled:opacity-40 ${
							inCompare
								? "bg-primary-100 text-white"
								: "bg-white text-slate-400 hover:text-primary-100"
						}`}
					>
						<FiBarChart2 size={14} />
					</button>
				</div>
			)}

			{/* Image Container */}
			<Link
				href={`/home-item/product/${slugDesc}-${id}`}
				className='relative aspect-square w-full bg-[#F8F9FA] overflow-hidden flex items-center justify-center rounded-t-2xl'
			>
				<Picture
					src={image}
					alt={description}
					className='object-contain w-[85%] h-[85%] transition-transform duration-700 ease-out group-hover:scale-110'
				/>

				{/* Discount Badge — moved to left so it doesn't overlap the action buttons */}
				{discount > 0 && (
					<div className='absolute top-3 left-3 bg-slate-900 text-white text-sm font-black px-2 py-1 rounded-lg shadow-sm z-10'>
						-{discount}%
					</div>
				)}
			</Link>

			{/* Content Area */}
			<div className='flex flex-col flex-grow p-4'>
				{/* Title / Description */}
				<Link
					href={`/home-item/product/${slugDesc}-${id}`}
					className='text-sm font-semibold text-slate-800 line-clamp-2 mb-3 h-10 hover:text-primary-100 transition-colors leading-snug'
					dangerouslySetInnerHTML={{ __html: description }}
				/>

				{/* Bottom Row - Pushed to bottom */}
				<div className='mt-auto flex items-end justify-between gap-2'>
					<div className='flex flex-col'>
						{oldAmount && (
							<span className='text-[11px] line-through text-slate-400 font-medium mb-0.5'>
								<FormatMoney2 value={parseInt(oldAmount)} />
							</span>
						)}
						<span className='text-primary-100 font-black text-base sm:text-xl tracking-tight'>
							{price ? <FormatMoney2 value={price} /> : "N/A"}
						</span>
					</div>

					{price > 0 && (
						<div className='flex items-center'>
							{quantity === 0 ? (
								<button
									onClick={(e) => {
										e.preventDefault();
										addToCart();
									}}
									className='flex items-center justify-center rounded-xl bg-primary-100 size-10 text-white hover:bg-slate-900 transition-all duration-300 active:scale-90 shadow-lg shadow-primary-100/20'
									aria-label='Add to cart'
								>
									<RiShoppingBagFill className='text-xl' />
								</button>
							) : (
								<div className='flex items-center gap-2 sm:gap-3 rounded-xl bg-slate-50 p-1 border border-slate-200/60'>
									<button
										onClick={(e) => {
											e.preventDefault();
											decrease();
										}}
										className='size-7 sm:size-8 flex items-center justify-center rounded-lg bg-white text-slate-600 hover:text-red-500 shadow-sm transition-all active:scale-90'
									>
										<AiOutlineMinus size={14} />
									</button>
									<span className='text-xs sm:text-sm font-black text-slate-800 min-w-[14px] text-center'>
										{quantity}
									</span>
									<button
										onClick={(e) => {
											e.preventDefault();
											increase();
										}}
										className='size-7 sm:size-8 flex items-center justify-center rounded-lg bg-primary-100 text-white shadow-sm transition-all hover:opacity-90 active:scale-90'
									>
										<AiOutlinePlus size={14} />
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Subtle border overlay for premium feel */}
			<div className='absolute inset-0 rounded-2xl border border-black/[0.03] pointer-events-none' />
		</div>
	);
};

export default ProductCard2;

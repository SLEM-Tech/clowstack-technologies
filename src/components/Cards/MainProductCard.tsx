"use client";
import { electonicImageNameImg1 } from "@public/images";
import React, { useState } from "react";
import Rating from "../Rating";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPayLaterDataState } from "../config/features/payLaterDataState";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { Product, mainProductCardData } from "@constants";
import { useCart } from "react-use-cart";
import { BsFillBagPlusFill } from "react-icons/bs";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FiHeart, FiBarChart2 } from "react-icons/fi";
import { RootState } from "../config/store";
import { RootState as LegacyRootState } from "../set-up/redux/root-reducer";
import { toggleWishlist } from "../Redux/Wishlist";
import { toggleCompare } from "../Redux/Compare";
import Picture from "../picture/Picture";

interface MainProductCardProps {
	items: ProductType;
}

const MainProductCard = ({ items }: MainProductCardProps) => {
	const dispatch = useDispatch();
	const { addItem, removeItem, updateItem, getItem } = useCart();
	const [count, setCount] = useState(0);
	const cartItem = getItem(items?.id?.toString());
	const router = useRouter();
	const cartItemCount = cartItem ? cartItem?.quantity : 0;

	const wishlisted = useSelector((state: LegacyRootState) =>
		state.wishlist.items.some((i) => i.id === items?.id),
	);
	const inCompare = useSelector((state: LegacyRootState) =>
		state.compare.items.some((i) => i.id === items?.id),
	);
	const compareCount = useSelector(
		(state: LegacyRootState) => state.compare.items.length,
	);

	const handleClick = () => {
		router.push(`/home-item/product/${items?.name}-${items?.id}`);
	};

	const handleCartClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCount(count + 1);
		addItem({
			id: items?.id.toString(),
			name: items?.name,
			price: parseInt(items?.sale_price),
			quantity: count,
			image: items?.images[0]?.src,
		});
	};

	const handleMinusCartClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const newCount = Math.max(count - 1, 0);
		if (newCount === 0) {
			removeItem(items?.id?.toString());
		} else {
			updateItem(items?.id?.toString(), { quantity: newCount });
		}
		setCount(newCount);
	};

	const handlePlusCartClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const newCount = count + 1;
		addItem({
			id: items?.id?.toString(),
			name: items?.name,
			price: parseInt(items?.sale_price),
			quantity: count,
			image: items?.images[0]?.src,
		});
		setCount(newCount);
	};

	const handleWishlist = (e: React.MouseEvent) => {
		e.stopPropagation();
		dispatch(toggleWishlist(items));
	};

	const handleCompare = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!inCompare && compareCount >= 4) return;
		dispatch(toggleCompare(items));
	};

	return (
		<div
			onClick={handleClick}
			className={`flex flex-col gap-2 justify-center items-center pt-4 sm:pt-9 pb-3 cursor-pointer transition
			border-[2px] border-[#bfbfbf1b] ring-[#bfbfbf2b] ring-opacity-50 relative group`}
		>
			{/* Wishlist & Compare action buttons — appear on hover */}
			<div className='absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10'>
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

			<div className='w-full flex-1 relative flex items-center justify-center px-8'>
				<Picture
					src={items?.images[0]?.src}
					alt={`${items?.name}`}
					className='object-contain h-28 w-28 slg:h-36 slg:w-36'
				/>
			</div>
			<div className='flex flex-col gap-2 sm:gap-4 mt-4 px-2 pb-4 w-full'>
				<div className='flex justify-between items-center'>
					<div className=''>
						<h4 className='stroke-black text-xs text-start line-through text-[#ccc]'>
							<FormatMoney2 value={parseInt(items?.regular_price)} />
						</h4>
						<h4 className='text-sm sm:text-base text-primary font-semibold leading-[1.8]'>
							<FormatMoney2 value={parseInt(items?.regular_price)} />
						</h4>
					</div>

					<div
						className={`flex items-center gap-1 rounded-md text-white p-1 text-xs sm:text-sm transition ${
							cartItemCount !== 0 && "bg-primary"
						}`}
					>
						{cartItemCount === 0 ? (
							<BsFillBagPlusFill
								className='fill-primary text-2xl'
								onClick={handleCartClick}
							/>
						) : (
							<>
								<AiOutlineMinus onClick={handleMinusCartClick} />
								<span className=''>{cartItemCount}</span>
								<AiOutlinePlus onClick={handlePlusCartClick} />
							</>
						)}
					</div>
				</div>
				<h4
					className='truncate text-xs sm:text-sm text-text_color font-semibold leading-[1.3] w-[150px]'
					title={items?.name}
				>
					{items?.name}
				</h4>
			</div>
		</div>
	);
};

export default MainProductCard;

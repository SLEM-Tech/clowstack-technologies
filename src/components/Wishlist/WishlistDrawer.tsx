"use client";
import React from "react";
import Drawer from "rc-drawer";
import "rc-drawer/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../set-up/redux/root-reducer";
import {
	removeFromWishlist,
	clearWishlist,
	setWishlistOpen,
} from "../Redux/Wishlist";
import { useCart } from "react-use-cart";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { FiX, FiShoppingCart, FiTrash2, FiHeart } from "react-icons/fi";
import Link from "next/link";

const WishlistDrawer = () => {
	const dispatch = useDispatch();
	const { items, isOpen } = useSelector((state: RootState) => state.wishlist);
	const { addItem, getItem } = useCart();

	const onClose = () => dispatch(setWishlistOpen(false));

	const handleAddToCart = (product: ProductType) => {
		addItem({
			id: product.id.toString(),
			name: product.name,
			price: parseInt(product.sale_price || product.regular_price || "0"),
			quantity: 1,
			image: product.images?.[0]?.src ?? "",
		});
	};

	return (
		<Drawer
			open={isOpen}
			onClose={onClose}
			placement='right'
			width={typeof window !== "undefined" && window.innerWidth > 768 ? 440 : "100%"}
			maskClosable={true}
			maskStyle={{ backgroundColor: "rgba(0,0,0,0.45)" }}
		>
			<div className='flex flex-col h-full bg-white'>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
					<div className='flex items-center gap-2'>
						<FiHeart className='text-primary-100' size={20} />
						<h2 className='text-lg font-black text-slate-900 uppercase tracking-tight'>
							Wishlist
						</h2>
						<span className='bg-primary-100 text-white text-[10px] font-black rounded-full px-2 py-0.5'>
							{items.length}
						</span>
					</div>
					<button
						onClick={onClose}
						className='p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition'
					>
						<FiX size={18} />
					</button>
				</div>

				{/* Items */}
				<div className='flex-1 overflow-y-auto px-4 py-4 space-y-3'>
					{items.length === 0 ? (
						<div className='flex flex-col items-center justify-center h-full gap-4 text-center py-20'>
							<div className='w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center'>
								<FiHeart className='text-slate-300' size={36} />
							</div>
							<p className='text-sm font-black text-slate-700 uppercase tracking-tight'>
								Your wishlist is empty
							</p>
							<p className='text-xs text-slate-400 max-w-[200px]'>
								Tap the heart icon on any product to save it here.
							</p>
							<button
								onClick={onClose}
								className='mt-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl'
							>
								Browse Products
							</button>
						</div>
					) : (
						items.map((product) => {
							const inCart = !!getItem(product.id.toString());
							const price = parseInt(
								product.sale_price || product.regular_price || "0",
							);
							const oldPrice = parseInt(product.regular_price || "0");
							const hasDiscount =
								product.sale_price && parseInt(product.sale_price) < oldPrice;

							return (
								<div
									key={product.id}
									className='flex gap-3 bg-slate-50 rounded-2xl p-3 group'
								>
									{/* Image */}
									<Link
										href={`/home-item/product/${product.name}-${product.id}`}
										onClick={onClose}
										className='w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center'
									>
										{product.images?.[0]?.src ? (
											<img
												src={product.images[0].src}
												alt={product.name}
												className='w-full h-full object-contain p-1'
											/>
										) : (
											<div className='w-full h-full bg-slate-100' />
										)}
									</Link>

									{/* Info */}
									<div className='flex-1 min-w-0 flex flex-col justify-between'>
										<div>
											<Link
												href={`/home-item/product/${product.name}-${product.id}`}
												onClick={onClose}
												className='text-xs font-black text-slate-800 line-clamp-2 hover:text-primary-100 transition'
											>
												{product.name}
											</Link>
											<div className='flex items-center gap-2 mt-1'>
												<span className='text-sm font-black text-primary-100'>
													<FormatMoney2 value={price} />
												</span>
												{hasDiscount && (
													<span className='text-[10px] text-slate-400 line-through'>
														<FormatMoney2 value={oldPrice} />
													</span>
												)}
											</div>
										</div>

										{/* Actions */}
										<div className='flex items-center gap-2 mt-2'>
											<button
												onClick={() => handleAddToCart(product)}
												className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition ${
													inCart
														? "bg-green-500 text-white"
														: "bg-slate-900 text-white hover:bg-primary-100"
												}`}
											>
												<FiShoppingCart size={12} />
												{inCart ? "In Cart" : "Add to Cart"}
											</button>
											<button
												onClick={() => dispatch(removeFromWishlist(product.id))}
												className='p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition'
											>
												<FiTrash2 size={14} />
											</button>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Footer */}
				{items.length > 0 && (
					<div className='px-4 py-4 border-t border-gray-100 space-y-2'>
						<button
							onClick={() => dispatch(clearWishlist())}
							className='w-full py-3 border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition flex items-center justify-center gap-2'
						>
							<FiTrash2 size={14} />
							Clear Wishlist
						</button>
					</div>
				)}
			</div>
		</Drawer>
	);
};

export default WishlistDrawer;

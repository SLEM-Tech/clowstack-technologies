"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {
	FiShare2,
	FiShield,
	FiTruck,
	FiRefreshCw,
	FiCheckCircle,
} from "react-icons/fi";
import { useCart } from "react-use-cart";
import { useQuery } from "react-query";
import Picture from "../picture/Picture";
import SocialMediaShare from "../common/SocialMediaShare";
import { useProduct } from "../lib/woocommerce";
import RelatedProductsSection from "./RelatedProductsSection";
import { Skeleton } from "@heroui/react";
import Drawer from "rc-drawer";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import Image from "next/image";
import ProductTable from "../Tables/ProductTable";

interface ProductDisplaySectionProps {
	FormatedId?: string;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
	const cls = size === "lg" ? "text-2xl" : "text-sm";
	return (
		<span className={`flex gap-0.5 ${cls}`}>
			{[1, 2, 3, 4, 5].map((s) => (
				<span key={s} className={s <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}>
					★
				</span>
			))}
		</span>
	);
}

function ReviewsTab({ productId }: { productId: number }) {
	const [page, setPage] = useState(1);
	const { data, isLoading } = useQuery(
		["product-reviews", productId, page],
		() => fetch(`/api/products/${productId}/reviews?page=${page}&per_page=8`).then((r) => r.json()),
		{ keepPreviousData: true },
	);

	if (isLoading) {
		return (
			<div className="space-y-4 max-w-3xl">
				{[1, 2, 3].map((i) => (
					<div key={i} className="animate-pulse space-y-2 p-4 border border-slate-100 rounded-2xl">
						<div className="h-4 bg-slate-100 rounded w-1/4" />
						<div className="h-3 bg-slate-100 rounded w-full" />
						<div className="h-3 bg-slate-100 rounded w-3/4" />
					</div>
				))}
			</div>
		);
	}

	if (!data || !Array.isArray(data.reviews) || data.reviews.length === 0) {
		return (
			<p className="text-slate-400 text-sm">No reviews yet for this product.</p>
		);
	}

	const stats = data.stats;
	const dist = stats?.distribution ?? {};

	return (
		<div className="max-w-3xl space-y-8">
			{/* Summary */}
			<div className="flex flex-col sm:flex-row gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
				<div className="flex flex-col items-center justify-center min-w-[100px]">
					<span className="text-5xl font-black text-slate-900">
						{stats?.average?.toFixed(1) ?? "0.0"}
					</span>
					<StarRating rating={stats?.average ?? 0} size="lg" />
					<span className="text-xs text-slate-400 mt-1">{stats?.total ?? 0} review{stats?.total !== 1 ? "s" : ""}</span>
				</div>
				<div className="flex-1 space-y-1.5">
					{[5, 4, 3, 2, 1].map((star) => {
						const c = dist[star] ?? 0;
						const pct = stats?.total ? Math.round((c / stats.total) * 100) : 0;
						return (
							<div key={star} className="flex items-center gap-2 text-xs text-slate-500">
								<span className="w-4 text-right">{star}</span>
								<span className="text-yellow-400">★</span>
								<div className="flex-1 bg-slate-200 rounded-full h-1.5">
									<div
										className="bg-yellow-400 h-1.5 rounded-full transition-all"
										style={{ width: `${pct}%` }}
									/>
								</div>
								<span className="w-6 text-right">{c}</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Review list */}
			<div className="space-y-4">
				{data.reviews.map((review: any) => (
					<div
						key={review.id}
						className="p-5 border border-slate-100 rounded-2xl space-y-2 bg-white"
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="flex items-center gap-2">
									<span className="font-bold text-slate-800 text-sm">{review.reviewer}</span>
									{review.verified && (
										<span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
											Verified
										</span>
									)}
								</div>
								<StarRating rating={review.rating} />
							</div>
							<span className="text-[11px] text-slate-400 whitespace-nowrap">
								{new Date(review.created_at).toLocaleDateString("en-GB", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</span>
						</div>
						<p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
					</div>
				))}
			</div>

			{/* Pagination */}
			{data.pages > 1 && (
				<div className="flex gap-2 justify-center">
					{Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
						<button
							key={p}
							onClick={() => setPage(p)}
							className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
								p === page
									? "bg-slate-900 text-white"
									: "bg-slate-100 text-slate-600 hover:bg-slate-200"
							}`}
						>
							{p}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

const ProductDisplaySection = ({ FormatedId }: ProductDisplaySectionProps) => {
	const [selectedImage, setSelectedImage] = useState(0);
	const { data: product, isLoading } = useProduct(FormatedId);
	const Product: ProductType = product;

	const pathname = usePathname();
	const { addItem, removeItem, updateItem, getItem } = useCart();

	const [baseUrl, setBaseUrl] = useState("");
	const [isLoadingMainImage, setIsLoadingMainImage] = useState(false);
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [drawerWidth, setDrawerWidth] = useState<number | string>("100%");
	const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

	const onOpenCart = () => setIsCartOpen(true);
	const onCloseCart = () => setIsCartOpen(false);

	useEffect(() => {
		setBaseUrl(`${window.location.protocol}//${window.location.host}`);
		setDrawerWidth(window.innerWidth > 768 ? 600 : "100%");
	}, []);

	// Calculate Discount
	const discount = useMemo(() => {
		if (!Product?.regular_price || !Product?.price) return 0;
		const reg = parseInt(Product.regular_price);
		const sale = parseInt(Product.price);
		if (reg <= sale) return 0;
		return Math.round(((reg - sale) / reg) * 100);
	}, [Product]);

	if (isLoading) {
		return (
			<section className='max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10'>
				<Skeleton className='aspect-square w-full rounded-3xl' />
				<div className='space-y-6'>
					<Skeleton className='h-10 w-3/4 rounded-lg' />
					<Skeleton className='h-6 w-1/4 rounded-lg' />
					<Skeleton className='h-20 w-full rounded-lg' />
					<Skeleton className='h-12 w-1/3 rounded-full' />
				</div>
			</section>
		);
	}

	if (!Product) return null;

	const ID = Product.id.toString();
	const price = parseInt(Product.price);
	const cartItem = getItem(ID);
	const qty = cartItem?.quantity || 0;

	const increase = () =>
		addItem({
			id: ID,
			name: Product.name,
			price,
			quantity: qty + 1,
			image: Product.images[0]?.src,
		});
	const decrease = () =>
		qty <= 1 ? removeItem(ID) : updateItem(ID, { quantity: qty - 1 });

	return (
		<>
			<section className='max-w-7xl mx-auto px-4 py-3 lg:py-12'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
					{/* --- LEFT: IMAGE GALLERY --- */}
					<div className='flex flex-col gap-6'>
						<div className='relative aspect-square bg-gray-100 rounded-md lg:rounded-[2rem] overflow-hidden border border-slate-100 group'>
							{discount > 0 && (
								<div className='absolute top-6 left-6 z-10 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg'>
									SAVE {discount}%
								</div>
							)}

							<Image
								src={Product.images[selectedImage]?.src}
								alt={Product.name}
								className={`w-full h-full object-contain p-2 lg:p-8 transition-all duration-700 ${isLoadingMainImage ? "scale-95 opacity-50" : "scale-100 opacity-100"}`}
								width={1000}
								height={1000}
								priority
								onLoad={() => setIsLoadingMainImage(false)}
							/>
						</div>

						{Product.images.length > 1 && (
							<div className='flex gap-4 overflow-x-auto no-scrollbar p-2'>
								{Product.images.map((img, index) => (
									<button
										key={img.id}
										onClick={() => setSelectedImage(index)}
										className={`relative flex-shrink-0 size-20 rounded-2xl border-2 transition-all overflow-hidden bg-white p-1 ${
											selectedImage === index
												? "border-primary-100 shadow-md scale-105"
												: "border-slate-100 hover:border-slate-300"
										}`}
									>
										<Picture
											src={img.src}
											alt=''
											className='w-full h-full object-cover rounded-xl'
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* --- RIGHT: PRODUCT INFO --- */}
					<div className='flex flex-col'>
						<div className='space-y-2 border-b border-slate-100 pb-6'>
							<div className='flex items-center gap-2'>
								<span
									dangerouslySetInnerHTML={{
										__html: Product.categories[0]?.name,
									}}
									className='text-[10px] font-black uppercase tracking-[2px] text-primary-100'
								/>

								<span className='size-1 rounded-full bg-slate-300' />
							</div>
							<h1 className='text-3xl lg:text-4xl font-black text-slate-900 leading-tight'>
								{Product.name}
							</h1>

							<div className='flex gap-4 pt-2'>
								<div className='flex flex-col'>
									{Product.regular_price &&
										parseInt(Product.regular_price) > price && (
											<span className='text-sm text-slate-400 line-through font-medium'>
												<FormatMoney2 value={parseInt(Product.regular_price)} />
											</span>
										)}
									<span className='text-3xl font-black text-primary-100 tracking-tighter'>
										<FormatMoney2 value={price} />
									</span>
								</div>
								<div
									className={`px-3 py-1 rounded-full text-[10px] h-fit font-black uppercase border ${
										Product.stock_status === "instock"
											? "bg-green-50 text-green-600 border-green-100"
											: "bg-red-50 text-red-600 border-red-100"
									}`}
								>
									{Product.stock_status === "instock"
										? "Available in Stock"
										: "Out of Stock"}
								</div>
							</div>
						</div>

						{/* Attributes Section */}
						{Product.attributes.length > 0 && (
							<div className='py-6 space-y-4 border-b border-slate-100'>
								<p className='text-[11px] font-black uppercase tracking-widest text-slate-400'>
									Specifications
								</p>
								<div className='grid grid-cols-2 gap-4'>
									{Product.attributes.map((attr) => (
										<div
											key={attr.id}
											className='flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-100'
										>
											<span className='text-[10px] font-bold text-slate-400 uppercase'>
												{attr.name}
											</span>
											<span className='text-sm font-bold text-slate-700'>
												{attr.options.join(", ")}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Action Area */}
						<div className='py-8 space-y-6'>
							<div className='flex flex-wrap items-center gap-6'>
								<div className='flex flex-col gap-2'>
									<span className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
										Quantity
									</span>
									<div className='flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200'>
										<button
											onClick={decrease}
											className='size-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-red-500 transition-colors active:scale-90'
										>
											<AiOutlineMinus />
										</button>
										<span className='px-6 text-base font-black text-slate-800 min-w-[3rem] text-center'>
											{qty}
										</span>
										<button
											onClick={increase}
											className='size-10 flex items-center justify-center bg-primary-100 text-white rounded-xl shadow-md hover:opacity-90 transition-all active:scale-90'
										>
											<AiOutlinePlus />
										</button>
									</div>
								</div>

								<div className='flex-1 min-w-[200px] pt-6'>
									<button
										onClick={onOpenCart}
										disabled={Product.stock_status !== "instock"}
										className='w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-100 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
									>
										{qty > 0 ? "View in Cart" : "Add to Cart"}
									</button>
								</div>
							</div>

							{/* Trust Badges */}
							<div className='grid grid-cols-2 gap-4 py-6 border-t border-slate-100'>
								<div className='flex flex-col items-center text-center gap-2'>
									<FiShield className='text-primary-100 text-xl' />
									<span className='text-[9px] font-bold uppercase text-slate-500'>
										Secure Payment
									</span>
								</div>
								<div className='flex flex-col items-center text-center gap-2 border-x border-slate-100'>
									<FiTruck className='text-primary-100 text-xl' />
									<span className='text-[9px] font-bold uppercase text-slate-500'>
										Fast Shipping
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Description & Reviews Tabs */}
				<div className='mt-2 lg:mt-20 w-[95%] overflow-x-auto'>
					<div className='flex gap-8 border-b border-slate-100 mb-8'>
						<button
							onClick={() => setActiveTab("description")}
							className={`pb-4 text-xs lg:text-sm font-black uppercase tracking-widest transition-colors ${
								activeTab === "description"
									? "border-b-2 border-slate-900 text-slate-900"
									: "text-slate-400 hover:text-slate-600"
							}`}
						>
							Description
						</button>
						<button
							onClick={() => setActiveTab("reviews")}
							className={`pb-4 text-xs lg:text-sm uppercase tracking-widest transition-colors ${
								activeTab === "reviews"
									? "border-b-2 border-slate-900 text-slate-900 font-black"
									: "text-slate-400 hover:text-slate-600 font-bold"
							}`}
						>
							Reviews ({Product.rating_count})
						</button>
					</div>

					{activeTab === "description" ? (
						<div
							className='text-base text-slate-600 leading-relaxed max-w-4xl prose prose-slate'
							dangerouslySetInnerHTML={{ __html: Product.description }}
						/>
					) : (
						<ReviewsTab productId={Product.id} />
					)}
				</div>

				<RelatedProductsSection
					productCategoryId={Product.categories[0]?.id.toString()}
				/>
			</section>

			<Drawer
				open={isCartOpen}
				onClose={onCloseCart}
				placement='right'
				width={drawerWidth}
				maskClosable={true}
			>
				<ProductTable onClose={onCloseCart} />
			</Drawer>
		</>
	);
};

export default ProductDisplaySection;

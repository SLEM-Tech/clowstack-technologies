"use client";
import React, { useEffect, useState, useTransition } from "react";
import { convertToSlug } from "@constants";
import { useCategories, WooCommerce, cacheGet, cacheSet } from "@src/components/lib/woocommerce";
import GlobalLoader from "@src/components/modal/GlobalLoader";
import Link from "next/link";
import { useCart } from "react-use-cart";
import { AiFillStar } from "react-icons/ai";
import { RiShoppingCartLine } from "react-icons/ri";
import Picture from "@src/components/picture/Picture";
import { FormatMoney2 } from "@src/components/Reusables/FormatMoney";
import { useDispatch } from "react-redux";
import { updateCategorySlugId } from "@src/components/config/features/subCategoryId";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────
   Home-page product card – matches the new UI
───────────────────────────────────────────── */
const HomeProductCard = ({ product }: { product: ProductType }) => {
	const { addItem, getItem, updateItem, removeItem } = useCart();
	const ID = product.id.toString();
	const cartItem = getItem(ID);
	const qty = cartItem?.quantity || 0;
	const price = parseInt(product.price);
	const oldPrice = parseInt(product.regular_price);
	const discount =
		oldPrice && price && oldPrice > price
			? Math.round(((oldPrice - price) / oldPrice) * 100)
			: 0;
	const slugDesc = convertToSlug(product.name);

	const handleAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		if (qty === 0) {
			addItem({
				id: ID,
				name: product.name,
				price,
				quantity: 1,
				image: product.images?.[0]?.src,
			});
		} else {
			updateItem(ID, { quantity: qty + 1 });
		}
	};

	const handleDecrease = (e: React.MouseEvent) => {
		e.preventDefault();
		if (qty <= 1) removeItem(ID);
		else updateItem(ID, { quantity: qty - 1 });
	};

	return (
		<div className='bg-white hover:shadow-md transition-shadow duration-200 relative group flex flex-col h-full'>
			{/* Discount badge */}
			{discount > 0 && (
				<span className='absolute top-2 left-2 bg-shop text-white text-[11px] font-bold px-1.5 py-0.5 z-10 rounded-sm'>
					{discount}%
				</span>
			)}

			{/* Image */}
			<Link
				href={`/home-item/product/${slugDesc}-${product.id}`}
				className='flex items-center justify-center h-40 bg-gray-50 overflow-hidden'
			>
				<Picture
					src={product.images?.[0]?.src}
					alt={product.name}
					className='h-32 w-full object-contain group-hover:scale-105 transition-transform duration-300'
				/>
			</Link>

			{/* Content */}
			<div className='p-3 border-t border-gray-100 flex flex-col flex-1'>
				<p className='text-[10px] text-gray-400 uppercase tracking-wide mb-0.5'>
					{product.categories?.[0]?.name || "Product"}
				</p>

				<Link
					href={`/home-item/product/${slugDesc}-${product.id}`}
					className='text-sm font-medium text-gray-800 line-clamp-1 hover:text-shop transition-colors leading-snug'
					dangerouslySetInnerHTML={{ __html: product.name }}
				/>

				{/* Star rating */}
				<div className='flex items-center gap-0.5 my-1.5'>
					{Array.from({ length: 4 }, (_, i) => (
						<AiFillStar key={i} className='text-yellow-400 text-xs' />
					))}
					<AiFillStar className='text-gray-200 text-xs' />
					<span className='text-[10px] text-gray-400 ml-1'>
						({product.rating_count || 1})
					</span>
				</div>

				{/* Price + add button */}
				<div className='flex items-center justify-between mt-auto pt-1'>
					<div className='flex flex-col'>
						<span className='text-sm font-bold text-gray-900'>
							{price ? <FormatMoney2 value={price} /> : "N/A"}
						</span>
						{oldPrice > price && (
							<span className='text-xs text-gray-400 line-through'>
								<FormatMoney2 value={oldPrice} />
							</span>
						)}
					</div>

					{qty === 0 ? (
						<button
							onClick={handleAdd}
							className='flex items-center gap-1 border border-shop text-shop text-xs px-2 py-1.5 rounded-sm hover:bg-shop hover:text-white transition-colors'
						>
							<RiShoppingCartLine className='text-sm' />
							Add
						</button>
					) : (
						<div className='flex items-center border border-shop rounded-sm overflow-hidden'>
							<button
								onClick={handleDecrease}
								className='px-2 py-1.5 text-shop hover:bg-shop hover:text-white transition-colors text-sm font-bold'
							>
								−
							</button>
							<span className='px-2 text-xs font-bold text-gray-800'>{qty}</span>
							<button
								onClick={handleAdd}
								className='px-2 py-1.5 bg-shop text-white text-sm font-bold'
							>
								+
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

/* ─────────────────────────────────────────
   Skeleton loader placeholder
───────────────────────────────────────── */
const ProductSkeleton = () => (
	<div className='bg-white'>
		<div className='h-40 bg-gray-100 animate-pulse' />
		<div className='p-3 space-y-2'>
			<div className='h-3 bg-gray-100 rounded animate-pulse w-1/3' />
			<div className='h-4 bg-gray-100 rounded animate-pulse' />
			<div className='h-3 bg-gray-100 rounded animate-pulse w-1/2' />
			<div className='flex justify-between mt-2'>
				<div className='h-5 bg-gray-100 rounded animate-pulse w-1/3' />
				<div className='h-7 bg-gray-100 rounded animate-pulse w-1/4' />
			</div>
		</div>
	</div>
);

/* ─────────────────────────────────────────────────────
   Single "Popular Products" section with filter tabs
───────────────────────────────────────────────────── */
interface PopularSectionProps {
	allCategories: CategoryType[];
	categoryProductsMap: { [key: string]: ProductType[] };
	isLoading: boolean;
}

const PopularProductsSection = ({
	allCategories,
	categoryProductsMap,
	isLoading,
}: PopularSectionProps) => {
	const dispatch = useDispatch();
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [activeTab, setActiveTab] = useState<string>("all");

	const displayedProducts: ProductType[] =
		activeTab === "all"
			? allCategories
					.flatMap((c) => categoryProductsMap[c.id.toString()] || [])
					.slice(0, 10)
			: (categoryProductsMap[activeTab] || []).slice(0, 10);

	const handleCategoryClick = (name: string, id: number) => {
		const categorySlugId = `${convertToSlug(name) + "-" + id}`;
		dispatch(updateCategorySlugId({ categorySlugId }));
		startTransition(() => {
			router.push(`/category/${convertToSlug(name) + "-" + id}`);
		});
	};

	if (!isLoading && allCategories.length === 0) return null;

	return (
		<section className='py-6 bg-white'>
			<div className='max-w-[1440px] mx-auto px-4 sm:px-8'>
				{/* Section header + filter tabs */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-200 pb-3'>
					<h2 className='text-xl font-bold text-gray-900'>Popular Products</h2>

					<div className='flex items-center flex-wrap gap-0.5'>
						<button
							onClick={() => setActiveTab("all")}
							className={`text-sm px-3 py-1.5 transition-colors ${
								activeTab === "all"
									? "text-shop border-b-2 border-shop font-semibold"
									: "text-gray-500 hover:text-shop"
							}`}
						>
							All
						</button>

						{allCategories.map((cat) => (
							<button
								key={cat.id}
								onClick={() => setActiveTab(cat.id.toString())}
								className={`text-sm px-3 py-1.5 transition-colors ${
									activeTab === cat.id.toString()
										? "text-shop border-b-2 border-shop font-semibold"
										: "text-gray-500 hover:text-shop"
								}`}
								dangerouslySetInnerHTML={{ __html: cat.name }}
							/>
						))}
					</div>
				</div>

				{/* Products grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-l border-t border-gray-200'>
					{isLoading
						? Array.from({ length: 10 }).map((_, i) => (
								<div key={i} className='border-r border-b border-gray-200'>
									<ProductSkeleton />
								</div>
							))
						: displayedProducts.map((product) => (
								<div
									key={product.id}
									className='border-r border-b border-gray-200'
								>
									<HomeProductCard product={product} />
								</div>
							))}
				</div>

				<GlobalLoader isPending={isPending} />
			</div>
		</section>
	);
};

/* ────────────────────────────────
   Main exported component
──────────────────────────────── */
const SortedProducts = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [categoryProductsMap, setCategoryProductsMap] = useState<{
		[key: string]: ProductType[];
	}>({});

	const {
		data: categories,
		isLoading: categoryWpIsLoading,
		isError: categoryIsError,
	} = useCategories("");

	const filteredCategories: CategoryType[] = (categories || [])
		.filter((cat: CategoryType) => cat.count > 0)
		.slice(0, 6);

	// Two groups → two distinct "Popular Products" sections
	const group1 = filteredCategories.slice(0, 3);
	const group2 = filteredCategories.slice(3, 6);

	useEffect(() => {
		if (!filteredCategories.length) return;

		const fetchCategoryProducts = async () => {
			setIsLoading(true);
			try {
				const promises = filteredCategories.map(async (cat: CategoryType) => {
					const cacheKey = `sorted_products_${cat.id}`;
					const cached = cacheGet<ProductType[]>(cacheKey);
					if (cached) return { id: cat.id.toString(), products: cached };
					const response = await WooCommerce.get(
						`products?category=${cat.id}&per_page=10`,
					);
					cacheSet(cacheKey, response.data);
					return { id: cat.id.toString(), products: response.data };
				});
				const results = await Promise.all(promises);
				const map = results.reduce(
					(acc: any, r) => ({ ...acc, [r.id]: r.products }),
					{},
				);
				setCategoryProductsMap(map);
			} catch (error) {
				console.error("Error fetching category products:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategoryProducts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories]);

	if (categoryIsError) return null;

	return (
		<>
			<PopularProductsSection
				allCategories={group1.length ? group1 : filteredCategories}
				categoryProductsMap={categoryProductsMap}
				isLoading={isLoading || categoryWpIsLoading}
			/>

			{group2.length > 0 && (
				<PopularProductsSection
					allCategories={group2}
					categoryProductsMap={categoryProductsMap}
					isLoading={isLoading || categoryWpIsLoading}
				/>
			)}
		</>
	);
};

export default SortedProducts;

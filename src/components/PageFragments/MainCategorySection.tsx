"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ScaleLoader } from "react-spinners";
import ProductCard2 from "../Cards/ProductCard2";
import { Back } from "../Reusables";
import { useProductsByCategory } from "../lib/woocommerce";

const MainCategorySection = () => {
	const pathname = usePathname();
	const parts = pathname.split("-");
	const categoryId = parts[parts.length - 1];

	const {
		data: categoryProducts,
		isLoading,
	} = useProductsByCategory(categoryId);

	const products: ProductType[] = categoryProducts ?? [];
	const categoryName = products[0]?.categories?.[0]?.name ?? "";

	return (
		<section className='w-full mb-16'>
			{/* Header row */}
			{!isLoading && products.length > 0 && (
				<div className='mb-4 space-y-2'>
					<Back />
					<div className='flex items-center gap-2'>
						<h4
							dangerouslySetInnerHTML={{ __html: categoryName }}
							className='text-xl lg:text-2xl font-semibold tracking-tight text-gray-900'
						/>
						<span className='text-sm text-gray-400'>({products.length})</span>
					</div>
				</div>
			)}

			{/* Loading state */}
			{isLoading && (
				<div className='flex flex-col items-center justify-center min-h-[40vh] gap-3'>
					<ScaleLoader color='#3DBD7F' />
					<p className='text-sm text-gray-400'>Loading products…</p>
				</div>
			)}

			{/* Product grid */}
			{!isLoading && products.length > 0 && (
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6'>
					{products.map((product) => (
						<ProductCard2
							key={product.id}
							id={product.id}
							image={product.images[0]?.src}
							oldAmount={product.regular_price}
							newAmount={product.price}
							description={product.name}
							product={product}
						/>
					))}
				</div>
			)}

			{/* Empty state */}
			{!isLoading && products.length === 0 && (
				<div className='flex flex-col items-center justify-center min-h-[40vh] gap-2 bg-white rounded-xl border border-gray-100'>
					<p className='text-base font-medium text-gray-500'>
						No products in this category
					</p>
					<p className='text-sm text-gray-400'>Check back later</p>
				</div>
			)}
		</section>
	);
};

export default MainCategorySection;

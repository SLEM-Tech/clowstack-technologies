"use client";
import React, { useEffect, useState } from "react";
import { useCategories, WooCommerce } from "../lib/woocommerce";
import SubCategoryCard from "../Cards/SubCategoryCard";
import { heroImage3, heroImage4 } from "@public/images";
import Picture from "../picture/Picture";

const MainCategoryContent = () => {
	// WooCommerce API Category
	const {
		data: categories,
		isLoading: categoryWpIsLoading,
		isError: categoryIsError,
	} = useCategories("");

	const Categories: CategoryType[] = categories ?? [];

	const [categoryProductsMap, setCategoryProductsMap] = useState<{
		[key: string]: ProductType[];
	}>({});

	useEffect(() => {
		const fetchCategoryProducts = async () => {
			try {
				const filteredCategories = categories
					?.filter((category: CategoryType) => category?.count > 0)
					?.slice(0, 5);

				if (filteredCategories) {
					const productsPromises = filteredCategories.map(
						async (category: CategoryType) => {
							const response = await WooCommerce.get(
								`products?category=${category?.id}`,
							);

							// Check if there is at least one product in the category
							const firstProductImage =
								response?.data.length > 0
									? response?.data[0]?.images[0]?.src
									: null;

							return {
								categoryId: category?.id,
								firstProductImage: firstProductImage, // Store the first product's image
							};
						},
					);

					const productsResults = await Promise.all(productsPromises);

					// Update the state with the first product images mapped by category
					const productsMap = productsResults.reduce(
						(acc: any, result: any) => ({
							...acc,
							[result.categoryId]: result.firstProductImage,
						}),
						{},
					);

					setCategoryProductsMap(productsMap);
				}
			} catch (error) {
				console.error("Error fetching category products:", error);
			} finally {
			}
		};

		if (categories?.length) {
			fetchCategoryProducts();
		}
	}, [categories]);

	return (
		<>
			{categoryWpIsLoading && (
				<section className='mb-8'>
					<div className='w-full h-[100px] sm:h-[270px] bg-gray-200 rounded-md animate-pulse' />
				</section>
			)}

			{Categories && (
				<div className=''>
					<h4 className='text-xl sm:text-2xl mb-4 font-medium text-center'>
						All Categories
					</h4>
					<div className='flex flex-wrap justify-center gap-4 md:gap-6 px-4 sm:px-0'>
						{Categories?.map((data) => {
							const productImage: any = categoryProductsMap[data?.id];
							return (
								<SubCategoryCard
									key={data.id}
									name={data?.name}
									id={data?.id?.toString()}
									image={productImage}
								/>
							);
						})}
					</div>
				</div>
			)}
		</>
	);
};

export default MainCategoryContent;

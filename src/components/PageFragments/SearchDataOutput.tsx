import React from "react";
import ProductCard2 from "../Cards/ProductCard2";
import { ScaleLoader } from "react-spinners";

interface SearchDataOutputProps {
	data: ProductType[];
	isloading: boolean;
}

const SearchDataOutput = ({ data, isloading }: SearchDataOutputProps) => {
	// SwiperCore.Navigation;
	const productCards = data?.map((product) => (
		<ProductCard2
			key={product?.id}
			id={product?.id}
			image={product?.images[0]?.src}
			oldAmount={product?.regular_price}
			newAmount={product?.price}
			description={product?.name}
			product={product}
		/>
	));

	return (
		<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
			{productCards}
		</div>
	);
};

export default SearchDataOutput;

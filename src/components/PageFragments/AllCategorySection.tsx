"use client";
import React, { useState } from "react";
import Picture from "../picture/Picture";
import { heroBg } from "@public/images";

const AllCategorySection = () => {
	const [activeSlide, setActiveSlide] = useState(0);

	const slides = [
		{
			heading: "Quality Accessories",
			subheading: "Big discount",
			description: "Shop the best deals on tech accessories today",
		},
		{
			heading: "Premium Hardware",
			subheading: "Best Prices",
			description: "Shop the latest tech accessories",
		},
		{
			heading: "Fast Delivery",
			subheading: "Nationwide",
			description: "Get products delivered to your door",
		},
	];

	return (
		<div className='relative w-full overflow-hidden' style={{ height: "420px" }}>
			{/* Background Image */}
			<Picture
				src={heroBg}
				alt='Quality Accessories'
				className='w-full h-full object-cover'
			/>

			{/* Dark overlay */}
			<div className='absolute inset-0 bg-black/55' />

			{/* Content */}
			<div className='absolute inset-0 flex flex-col items-center justify-center text-center px-4'>
				<h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-2'>
					{slides[activeSlide].heading}
					<br />
					<span className='text-white'>{slides[activeSlide].subheading}</span>
				</h1>

				<p className='text-gray-300 text-sm sm:text-base mt-2 mb-8'>
					{slides[activeSlide].description}
				</p>

				{/* Dot Pagination */}
				<div className='flex items-center gap-2'>
					{slides.map((_, i) => (
						<button
							key={i}
							onClick={() => setActiveSlide(i)}
							className={`rounded-full transition-all duration-300 ${
								i === activeSlide
									? "w-6 h-2.5 bg-shop"
									: "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default AllCategorySection;

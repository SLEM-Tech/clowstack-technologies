"use client";
import React from "react";
import Picture from "@src/components/picture/Picture";
import { machineImage, subscribeSection } from "@public/images";

const MachineMaintenance = () => {
	return (
		<section className='w-full relative overflow-hidden'>
			{/* Background image */}
			<Picture
				src={subscribeSection}
				alt='background'
				className='absolute inset-0 w-full h-full object-cover'
			/>

			{/* bg-shop-light overlay */}
			<div className='absolute inset-0 bg-shop-light/90' />

			{/* Content */}
			<div className='relative max-w-[1440px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
				{/* Left – text */}
				<div className='space-y-5'>
					<h2 className='text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight'>
						Stay home &amp; get your daily
						<br />
						needs from our shop
					</h2>

					<p className='text-gray-600 text-sm sm:text-base'>
						Start Your Daily Shopping with ClowStack Technologies
					</p>
				</div>

				{/* Right – product image */}
				<div className='flex items-center justify-center'>
					<Picture
						src={machineImage}
						alt='Shop daily needs'
						className='w-full max-w-sm object-contain drop-shadow-lg'
					/>
				</div>
			</div>
		</section>
	);
};

export default MachineMaintenance;

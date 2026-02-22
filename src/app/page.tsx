import AppLayout from "@src/components/AppLayout";
import AllCategorySection from "@src/components/PageFragments/AllCategorySection";
import SortedProducts from "./(Home)/_components/SortedProducts";
import { SEODATA } from "@constants/seoContants";
import { Metadata } from "next";
import AppMenu from "@src/components/Navbars/AppMenu";
import MachineMaintenance from "./(Home)/_components/MachineMaintenance";
import FaqAccordion from "@src/components/Reusables/Accordion/FaqAccordion";
import {
	FiTag,
	FiTruck,
	FiGift,
	FiGrid,
	FiRefreshCw,
} from "react-icons/fi";

const { description, title, ogImage, keywords } = SEODATA.home;
export const metadata: Metadata = {
	title: title,
	description: description,
	keywords: keywords,
	icons: ogImage,
	openGraph: {
		images: [
			{
				url: ogImage ?? "",
			},
		],
	},
};

const featuresData = [
	{
		icon: <FiTag className='text-2xl text-shop' />,
		title: "Best prices & offers",
		subtitle: "Orders $50 or more",
	},
	{
		icon: <FiTruck className='text-2xl text-shop' />,
		title: "Free delivery",
		subtitle: "24/7 amazing services",
	},
	{
		icon: <FiGift className='text-2xl text-shop' />,
		title: "Great daily deal",
		subtitle: "When you sign up",
	},
	{
		icon: <FiGrid className='text-2xl text-shop' />,
		title: "Wide assortment",
		subtitle: "Mega Discounts",
	},
	{
		icon: <FiRefreshCw className='text-2xl text-shop' />,
		title: "Easy returns",
		subtitle: "Within 30 days",
	},
];

const page = () => {
	return (
		<AppLayout>
			{/* Hero banner */}
			<AllCategorySection />

			{/* Popular Products grids – powered by WooCommerce */}
			<SortedProducts />

			{/* Stay-home CTA banner */}
			<MachineMaintenance />

			{/* Features bar */}
			<section className='bg-white border-t border-b border-gray-200'>
				<div className='max-w-[1440px] mx-auto px-4 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
					{featuresData.map((f, i) => (
						<div key={i} className='flex items-center gap-3'>
							<div className='size-10 bg-shop-light rounded-full flex items-center justify-center shrink-0'>
								{f.icon}
							</div>
							<div>
								<p className='text-sm font-semibold text-gray-800 leading-tight'>
									{f.title}
								</p>
								<p className='text-xs text-gray-400'>{f.subtitle}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* FAQ section */}
			<section className='flex w-full flex-col items-center pt-16 slg:px-16 text-center bg-white'>
				<h3 className='font-semibold text-xl sm:text-2xl slg:text-4xl tracking-tighter'>
					Frequently Asked Question
				</h3>
				<FaqAccordion />
			</section>

			<AppMenu />
		</AppLayout>
	);
};

export default page;

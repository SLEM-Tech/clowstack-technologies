import AppLayout from "@src/components/AppLayout";
import AppMenu from "@src/components/Navbars/AppMenu";
import MainCategorySection from "@src/components/PageFragments/MainCategorySection";
import { WooCommerceServer } from "@utils/endpoints";

export async function generateStaticParams() {
	try {
		// Fetch categories from WooCommerce
		const response = await WooCommerceServer.get("products/categories");
		const categories = response.data;

		const categoriesSorted: string[] = categories?.map(
			(category: { id: number; slug: string }) =>
				`${category?.slug}-${category?.id}`,
		);

		return categoriesSorted?.map((id) => ({ id }));
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}

// export async function generateStaticParams() {
// 	try {
// 		// Generate static paths using the slug and ID
// 		const paths = [{ id: "id" }];

// 		return paths; // Return the hardcoded paths
// 	} catch (error) {
// 		console.error("Error fetching products in generateStaticParams:", error);
// 		// Return an empty array to avoid breaking the build process
// 		return [];
// 	}
// }

const page = async () => {
	return (
		<AppLayout>
			<div className='max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-6'>
				<MainCategorySection />
			</div>
			<AppMenu />
		</AppLayout>
	);
};

export default page;

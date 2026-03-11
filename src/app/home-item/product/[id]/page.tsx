import AppLayout from "@src/components/AppLayout";
import AppMenu from "@src/components/Navbars/AppMenu";
import ProductDisplaySection from "@src/components/PageFragments/ProductDisplaySection";
import { Back } from "@src/components/Reusables";
import { WooCommerceServer } from "@utils/endpoints";

export async function generateStaticParams() {
	try {
		const response = await WooCommerceServer.get("products");
		const raw = response?.data;
		const products: { id: number; slug: string }[] = Array.isArray(raw)
			? raw
			: Array.isArray(raw?.products)
				? raw.products
				: [];

		return products.map((product) => ({
			id: `${product.slug}-${product.id}`,
		}));
	} catch (error) {
		console.error("Error fetching products in generateStaticParams:", error);
		return [];
	}
}

// const page = async ({ params: { id } }: ProductIdProps) => {
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const lastPart = id.split("/").pop();
	const formatedId = lastPart?.match(/-(\w+)$/)?.[1];

	return (
		<AppLayout className='pt-32 slg:pt-40 mx-auto max-w-[1156px]'>
			<Back />
			<ProductDisplaySection FormatedId={formatedId} />
			<AppMenu />
		</AppLayout>
	);
};

export default page;

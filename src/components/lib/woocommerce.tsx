"use client";
import { signOut } from "@utils/lib";
import { WC_ConsumerKey, WC_consumerSecret, WC_URL } from "@utils/lib/data";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { useMutation, useQuery } from "react-query";

/* ─────────────────────────────────────────────
   Persistent client-side cache (localStorage)
   with a configurable TTL (default: 1 hour)
───────────────────────────────────────────── */
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in ms
const CACHE_PREFIX = "__wc_cache_";

export function cacheGet<T>(key: string): T | null {
	try {
		const raw = localStorage.getItem(CACHE_PREFIX + key);
		if (!raw) return null;
		const { data, expires } = JSON.parse(raw) as { data: T; expires: number };
		if (Date.now() > expires) {
			localStorage.removeItem(CACHE_PREFIX + key);
			return null;
		}
		return data;
	} catch {
		return null;
	}
}

export function cacheSet(key: string, data: unknown, ttl = CACHE_TTL) {
	try {
		localStorage.setItem(
			CACHE_PREFIX + key,
			JSON.stringify({ data, expires: Date.now() + ttl }),
		);
	} catch {
		// Ignore (storage quota exceeded, SSR, etc.)
	}
}

export const WooCommerce = new WooCommerceRestApi({
	url: WC_URL, // Your store URL
	consumerKey: WC_ConsumerKey, // Your consumer key
	consumerSecret: WC_consumerSecret, // Your consumer secret
	version: "wc/v3", // WooCommerce API version
});

export const useCustomer = (customerId: string | undefined) => {
	return useQuery(
		["customer", customerId],
		async () => {
			const response = await WooCommerce.get(`customers/${customerId}`);
			return response.data;
		},
		{
			onError: (error: any) => {
				if (error.response?.status === 401 || error.response?.status === 403) {
					// Trigger signout if unauthorized
					signOut();
				} else {
					console.error("An error occurred:", error);
				}
			},
			staleTime: Infinity,
		},
	);
};

export const useProduct = (productId: string | undefined) => {
	return useQuery(
		["product", productId],
		async () => {
			const response = await WooCommerce.get(`products/${productId}`);
			return response.data;
		},
		{
			staleTime: Infinity,
		},
	);
};

export const useCustomerOrders = (customerId: number | string | undefined) => {
	return useQuery(
		["customer-orders", customerId],
		async () => {
			if (!customerId) throw new Error("Customer ID is required");

			const response = await WooCommerce.get("orders", {
				customer: customerId,
				per_page: 100, // Adjust as needed
				order: "desc", // Most recent first
				orderby: "date",
			});

			return response.data;
		},
		{
			enabled: !!customerId, // Only run if customerId exists
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: 2,
		},
	);
};

export const useOrders = (
	id?: string,
	page: number = 1,
	perPage: number = 10,
) => {
	return useQuery(
		["order", id, page, perPage],
		async () => {
			const endpoint = id
				? `orders/${id}`
				: `orders?page=${page}&per_page=${perPage}`;
			const response = await WooCommerce.get(endpoint);

			// Extract total items and total pages from headers
			const totalItems = parseInt(response.headers["x-wp-total"], 10);
			const totalPages = parseInt(response.headers["x-wp-totalpages"], 10);

			return {
				data: response.data,
				totalItems,
				totalPages,
			};
		},
		{
			keepPreviousData: true,
			refetchOnWindowFocus: true,
			staleTime: Infinity,
		},
	);
};

export const useMediaUpload = () => {
	return useMutation(async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", `Receipt_${Date.now()}`);

		const response = await fetch(`${WC_URL}/wp-json/wp/v2/media`, {
			method: "POST",
			headers: {
				// We use Basic Auth for the Media API (ConsumerKey:ConsumerSecret)
				Authorization:
					"Basic " + btoa(`${WC_ConsumerKey}:${WC_consumerSecret}`),
			},
			body: formData,
		});

		if (!response.ok) throw new Error("Media upload failed");
		return await response.json();
	});
};

// Hook for Updating the Order
export const useUpdateOrder = () => {
	return useMutation(
		async ({ orderId, data }: { orderId: number; data: any }) => {
			const response = await WooCommerce.put(`orders/${orderId}`, data);
			return response.data;
		},
	);
};

export const useProductSearch = (query: string | undefined) => {
	return useQuery(
		["product-search", query],
		async () => {
			const response = await WooCommerce.get(`products?search=${query}`);
			return response.data;
		},
		{
			staleTime: Infinity,
		},
	);
};

export const useGeneralSettings = () => {
	return useQuery("general-settings", async () => {
		const response = await WooCommerce.get("settings/general");
		return response.data;
	});
};

// export const useBankTransferSettings = () => {
// 	return useQuery("bank-transfer-accounts", async () => {
// 		const response = await WooCommerce.get("payment_gateways/bacs");

// 		return response.data.settings;
// 	});
// };

export const useCategories = (categoryId: string | undefined) => {
	const cacheKey = `categories_${categoryId ?? "all"}`;
	return useQuery(
		["categories", categoryId],
		async () => {
			const cached = cacheGet<CategoryType[]>(cacheKey);
			if (cached) return cached;
			const response = await WooCommerce.get(
				`products/categories/${categoryId}`,
			);
			cacheSet(cacheKey, response.data);
			return response.data;
		},
		{
			staleTime: Infinity,
		},
	);
};

export const useCreateOrder = () => {
	return useMutation(async (orderData: any) => {
		const response = await WooCommerce.post("orders", orderData);
		return response.data;
	});
};

export const useProductsByCategory = (categoryId: string) => {
	const cacheKey = `products_cat_${categoryId}`;
	return useQuery(["category-products", categoryId], async () => {
		const cached = cacheGet<ProductType[]>(cacheKey);
		if (cached) return cached;
		const response = await WooCommerce.get(`products?category=${categoryId}`);
		cacheSet(cacheKey, response.data);
		return response.data;
	});
};

export const useUpdateCustomer = () => {
	return useMutation(async (updatedCustomerData: any) => {
		const { id, ...data } = updatedCustomerData; // Ensure you pass in the customer ID along with the new data
		const response = await WooCommerce.put(`customers/${id}`, data);
		return response.data;
	});
};

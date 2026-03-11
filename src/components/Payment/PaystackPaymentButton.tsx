"use client"; // Ensure it's a client component if using Next.js App Router

import dynamic from "next/dynamic";
// import { FormValues } from "@src/app/checkout/component/CheckoutInfoForm";
import FormToast from "../Reusables/Toast/SigninToast";
import { PAYSTACK_PUBLIC_KEY } from "@utils/lib/data";
import { useCart } from "react-use-cart";
import { useCreateOrder, useCustomer } from "../lib/woocommerce";
import { useRouter } from "next/navigation";
import { filterCustomersByEmail } from "@constants";
import useToken from "../hooks/useToken";

import { useAppSelector } from "../hooks";
import { FormikProps } from "formik";
import { SITE_NAME } from "../../../constants/seoContants";

// Dynamically import PaystackButton to prevent SSR issues
const PaystackButton = dynamic(
	() => import("react-paystack").then((mod) => mod.PaystackButton),
	{
		ssr: false,
	},
);

interface PaystackPaymentButtonProps {
	formik: FormikProps<any>;
}

const PaystackPaymentButton = ({ formik }: PaystackPaymentButtonProps) => {
	const { items, emptyCart } = useCart();
	const { token, email } = useToken();
	const router = useRouter();
	const { baseCurrency, exchangeRate } = useAppSelector(
		(state) => state.currency,
	);
	const { data: customer } = useCustomer("");
	const wc_customer2_info: Woo_Customer_Type[] = customer ?? [];
	const wc_customer_info: Woo_Customer_Type | undefined =
		filterCustomersByEmail(wc_customer2_info, email);

	const orderData = {
		customer_id: wc_customer_info?.id,
		payment_method: "paystack-method",
		payment_method_title: "paystack",
		set_paid: true,
		billing: {
			first_name: wc_customer_info?.first_name,
			last_name: wc_customer_info?.last_name,
			address_1: wc_customer_info?.billing?.address_1,
			city: wc_customer_info?.billing?.city,
			state: wc_customer_info?.billing?.state,
			postcode: wc_customer_info?.billing?.postcode,
			country: wc_customer_info?.billing?.country,
			email: wc_customer_info?.email,
			phone: wc_customer_info?.billing?.phone,
		},
		line_items: items.map((item) => ({
			product_id: item.id,
			quantity: item.quantity,
			price: item.price, // Or any other property required by WooCommerce
		})),
	};
	const { mutate: createOrder } = useCreateOrder();

	const calculateSubtotal = () => {
		return items.reduce(
			(total, item: any) => total + item?.price * item?.quantity,
			0,
		);
	};
	const convertedValue = calculateSubtotal() * exchangeRate;

	const handleSuccess = (response: any) => {
		if (response.status === "success") {
			createOrder(orderData);
			FormToast({
				message: "Payment successful!",
				success: true,
			});
			emptyCart();
			router.push("/");
		}
	};

	const handleClose = () => {
		FormToast({
			message: "Payment was canceled",
			success: false,
		});
	};

	return (
		//  @ts-ignore
		<PaystackButton
			email={formik.values?.email ?? ""}
			amount={Math.round(convertedValue * 100)} // Amount in kobo
			currency={baseCurrency.code}
			publicKey={PAYSTACK_PUBLIC_KEY}
			text='Pay Now'
			label={SITE_NAME}
			onSuccess={handleSuccess}
			// disabled={!formik.isValid}
			onClose={handleClose}
			reference={`txn-${Date.now()}`} // Unique transaction reference
			className={`flex w-full justify-center items-center py-2 sm:py-3 px-14 mt-2 sm:mt-4 rounded-md text-white transition font-bold text-base ${
				formik.isValid
					? "bg-primary-100 cursor-pointer"
					: "cursor-not-allowed bg-red-500/60"
			}`}
		/>
	);
};

export default PaystackPaymentButton;

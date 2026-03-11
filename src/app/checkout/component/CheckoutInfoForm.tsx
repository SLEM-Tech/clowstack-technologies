"use client";
import { filterCustomersByEmail, generateUniqueReference } from "@constants";
import { FormatMoney2 } from "@src/components/Reusables/FormatMoney";
import FormToast from "@src/components/Reusables/Toast/SigninToast";
import {
	cardPaymentFormModel,
	checkoutFormModel,
} from "@src/components/config/models";
import { RadioGroup } from "@headlessui/react";
import { useAppSelector } from "@src/components/hooks";
import useToken from "@src/components/hooks/useToken";
import { useCreateOrder, useCustomer } from "@src/components/lib/woocommerce";
import AuthModal from "@src/components/modal/AuthModal";
import SignupModal from "@src/components/modal/SignupModal";
import { APICall } from "@utils";
import {
	cardPaymentRedirect,
	createOrderData,
	encryptOrderData,
	payOrder,
} from "@utils/endpoints";
import { City, ICity, State } from "country-state-city";
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { SlArrowDown } from "react-icons/sl";
import { useMutation } from "react-query";
import { ClipLoader } from "react-spinners";
import { useCart } from "react-use-cart";
import { PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY } from "@utils/lib/data";
import PaystackPaymentButton from "@src/components/Payment/PaystackPaymentButton";
import {
	RiShieldCheckFill,
	RiTruckLine,
	RiWallet3Line,
} from "@node_modules/react-icons/ri";
import { FiCheckCircle } from "@node_modules/react-icons/fi";

interface SelectOption {
	label: string;
	value: string;
}

interface PaymentFormValues {
	cardNumber: string; // The card number as a string
	expiryMonth: string; // The expiry month as a string
	expiryYear: string; // The expiry year as a string
	cvv: string; // The CVV as a string
}

export interface FormValues {
	firstName: string;
	lastName: string;
	email?: string;
	houseAddress?: string;
	phone?: string;
	orderNotes: string;
	city?: string;
	state?: string;
}

const CheckoutInfoForm = () => {
	const { token, email } = useToken();
	const router = useRouter();
	const [paystackLoading, setPaystackLoading] = useState(false);
	const states: SelectOption[] = State.getStatesOfCountry("NG").map(
		(state) => ({
			label: state.name,
			value: state.isoCode, // Use isoCode for accuracy
		}),
	);
	const [selectedPaymentChannel, setSelectedPaymentChannel] =
		useState("alliance_pay");
	const [citiesForSelectedState, setCitiesForSelectedState] = useState<
		SelectOption[]
	>([]);
	// const [citiesForSelectedCountry, setCitiesForSelectedCountry] = useState<
	// 	ICity[]
	// >([]);
	const [state, setState] = useState("");
	const [iframeUrl, setIframeUrl] = useState(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [paymentRef, setPaymentRef] = useState("");
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const { baseCurrency, exchangeRate } = useAppSelector(
		(state) => state.currency,
	);

	const {
		mutate: createOrder,
		isLoading: isLoadingCreateOrder,
		isError: isErrorCreateOrder,
		data: CreateOrderData,
	} = useCreateOrder();
	const {
		data: customer,
		isLoading: isLoadingCustomer,
		isError: isErrorCustomer,
	} = useCustomer("");
	const wc_customer2_info: Woo_Customer_Type[] = customer ?? [];
	const wc_customer_info: Woo_Customer_Type | undefined =
		filterCustomersByEmail(wc_customer2_info, email);

	const handleClosePaymentModal = () => {
		setIsPaymentModalOpen(false);
	};
	const handleCloseModal = () => {
		setIsModalOpen(false);
		router.push("/user/login");
	};

	const handleStateChange = (selectedOption: SelectOption | null) => {
		if (selectedOption) {
			const stateCode = selectedOption.value;
			const cities: ICity[] = City.getCitiesOfState("NG", stateCode);

			setCitiesForSelectedState(
				cities.map((city) => ({
					label: city.name,
					value: city.name,
				})),
			);

			formik.setFieldValue("state", selectedOption.label);
			formik.setFieldValue("city", ""); // Reset city when state changes
		}
	};
	const { items, emptyCart } = useCart();

	const calculateSubtotal = () => {
		return items.reduce(
			(total, item: any) => total + item?.price * item?.quantity,
			0,
		);
	};
	const convertedValue = calculateSubtotal() * exchangeRate;
	const calculateTotal = () => {
		return convertedValue;
		// You can add any additional charges or discounts here if needed.
	};

	useEffect(() => {
		if (calculateSubtotal() <= 0) {
			router.push("/");
		}
	}, [calculateSubtotal]);

	const AuthModalContent = () => (
		<>
			<h3 className='text-sm sm:text-base md:text-2xl md:px-12 text-black text-center'>
				Sorry! You have to login to make a request.
			</h3>
		</>
	);

	const orderData = {
		customer_id: wc_customer_info?.id,
		payment_method: "alliance-payment-card",
		payment_method_title: "alliance-payment",
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

	const payOrderMutation = useMutation(
		async (encryptedPaymentOrder: any) => {
			const response = await APICall(
				payOrder,
				encryptedPaymentOrder,
				true,
				true,
			);
			return response?.data;
		},
		{
			onSuccess: async (data, variable) => {
				const redirectUrl = data?.data?.payment_detail?.redirect_url;
				createOrder(orderData);

				if (redirectUrl) {
					setIframeUrl(redirectUrl); // Set URL to open in iframe
				}
			},
			onError: (error) => {
				console.error("Payment failed:", error);
			},
		},
	);

	const cardPaymentOrderMutation = useMutation(
		async (orderReferenceData: any) => {
			const response = await APICall(
				cardPaymentRedirect,
				orderReferenceData,
				false,
				true,
			);
			return response?.data;
		},
		{
			onSuccess: async (data, variable) => {
				const payOrderRef = {
					data: data,
				};

				await payOrderMutation.mutateAsync(payOrderRef);
			},
			onError: (error: any) => {
				let errorMessage = "An unexpected error occurred. Please try again.";

				// Attempt to extract a more specific error message if available
				if (error?.response?.data?.message) {
					errorMessage = error.response.data.message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				// Display the error message in the toast notification
				FormToast({
					message: errorMessage,
					success: false, // Set to false since this is an error
				});
			},
		},
	);

	const createdOrderMutation = useMutation(
		async (encrytedData: any) => {
			const response = await APICall(
				createOrderData,
				encrytedData,
				false,
				true,
			);
			return response?.data;
		},
		{
			onSuccess: async (data: OrderPaymentResponse, variable) => {
				setPaymentRef(data?.data?.order?.reference);
				setIsPaymentModalOpen(true);
			},
			onError: (error: any) => {
				let errorMessage = "An unexpected error occurred. Please try again.";

				// Attempt to extract a more specific error message if available
				if (error?.response?.data?.message) {
					errorMessage = error.response.data.message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				// Display the error message in the toast notification
				FormToast({
					message: errorMessage,
					success: false, // Set to false since this is an error
				});
			},
		},
	);

	const encryptedMutation = useMutation(
		async (data: any) => {
			const response = await APICall(encryptOrderData, data, false, true);
			return response?.data;
		},
		{
			onSuccess: async (data, variable) => {
				const dataPassed = {
					data: data,
				};
				await createdOrderMutation.mutateAsync(dataPassed);
			},
			onError: (error: any) => {
				let errorMessage = "An unexpected error occurred. Please try again.";

				// Attempt to extract a more specific error message if available
				if (error?.response?.data?.message) {
					errorMessage = error.response.data.message;
				} else if (error?.message) {
					errorMessage = error.message;
				}

				FormToast({
					message: errorMessage,
					success: false, // Set to false since this is an error
				});
			},
		},
	);

	const handleFormSubmit = async (value: FormValues) => {
		const dataPayload = {
			Customer: {
				first_name: value?.firstName,
				last_name: value?.lastName,
				mobile: value?.phone?.toString(),
				country: baseCurrency.countryCode,
				email: value?.email,
			},
			Order: {
				amount: convertedValue,
				reference: generateUniqueReference(),
				description: value?.orderNotes,
				currency: baseCurrency.code,
			},
		};

		if (token) {
			await encryptedMutation.mutateAsync(dataPayload);
		} else {
			setIsModalOpen(true);
		}
	};

	const handleCreateOrder = async (
		value: PaymentFormValues,
		setSubmitting: (val: boolean) => void,
	) => {
		const orderPaymentData = {
			reference: paymentRef,
			payment_option: "C",
			country: baseCurrency.countryCode,
			card: {
				cvv: value.cvv,
				card_number: value.cardNumber,
				expiry_month: value.expiryMonth,
				expiry_year: value.expiryYear,
			},
		};
		await cardPaymentOrderMutation.mutateAsync(orderPaymentData);
	};

	const initialValues: FormValues = {
		firstName: wc_customer_info?.first_name || "",
		lastName: wc_customer_info?.last_name || "",
		email: wc_customer_info?.email || "",
		houseAddress: wc_customer_info?.billing?.address_1 || "",
		phone: wc_customer_info?.billing?.phone || "",
		orderNotes: "",
		city: wc_customer_info?.billing?.city || "",
		state: wc_customer_info?.billing?.state || "",
	};

	// console.log("initialValues", initialValues);

	const initializePaystackPayment = async (values: FormValues) => {
		if (!PAYSTACK_PUBLIC_KEY || !PAYSTACK_SECRET_KEY) {
			throw new Error("Paystack API keys are missing!");
		}

		const response = await fetch(
			"https://api.paystack.co/transaction/initialize",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, // Secret key should never be exposed to the client
				},
				body: JSON.stringify({
					email: values.email, // The email of the user making the payment
					amount: Math.round(convertedValue * 100), // Amount in kobo (convert to kobo)
					currency: baseCurrency.code, // Paystack supports multiple currencies, use NGN for Nigerian Naira
				}),
			},
		);

		const data = await response.json();

		if (data.status) {
			return data.data.authorization_url; // Return the authorization URL to be used
		} else {
			throw new Error(data.message); // Throw an error if something went wrong
		}
	};

	// const paystackMutation = useMutation(initializePaystackPayment, {
	// 	onMutate: () => {
	// 		setPaystackLoading(true); // Set loading to true when the mutation starts
	// 	},
	// 	onSuccess: (authorizationUrl: string) => {
	// 		setPaystackLoading(false); // Set loading to false once the URL is ready
	// 	},
	// 	onError: (error: any) => {
	// 		// console.error("Error initializing Paystack payment:", error);
	// 		FormToast({
	// 			message: error?.message,
	// 			success: false,
	// 		});
	// 		setPaystackLoading(false); // Reset loading state on error
	// 	},
	// 	onSettled: () => {
	// 		setPaystackLoading(false); // Always reset loading when mutation completes (success or error)
	// 	},
	// });

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: checkoutFormModel,
		enableReinitialize: true,
		onSubmit: async (values) => {
			if (selectedPaymentChannel === "alliance_pay") {
				await handleFormSubmit(values);
			}
		},
	});

	const paymentInitialValues: PaymentFormValues = {
		cardNumber: "",
		expiryMonth: "",
		expiryYear: "",
		cvv: "",
	};

	const paymentFormik = useFormik({
		initialValues: paymentInitialValues,
		validationSchema: cardPaymentFormModel,
		validateOnChange: false,
		validateOnBlur: true, // validate only on blur
		onSubmit: (values, { setSubmitting }) => {
			handleCreateOrder(values, setSubmitting);
		},
	});

	return (
		<>
			<FormikProvider value={formik}>
				<Form className='max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8'>
					{/* LEFT SIDE: Information Entry (8 Columns) */}
					<div className='lg:col-span-8 space-y-6'>
						<div className='bg-white rounded-3xl p-6 sm:p-10 lg:shadow-sm lg:border border-gray-100'>
							<div className='flex items-center justify-center lg:justify-start gap-3 mb-8'>
								<RiTruckLine className='text-2xl text-primaryColor-100' />
								<h2 className='text-xl font-black text-gray-900 tracking-tight'>
									Delivery Details
								</h2>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										First Name
									</label>
									<Field
										name='firstName'
										placeholder='e.g. John'
										className='w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primaryColor-100/20 transition-all outline-none'
									/>
									<ErrorMessage
										name='firstName'
										component='div'
										className='text-red-500 text-xs mt-1 ml-2'
									/>
								</div>
								<div className='space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										Last Name
									</label>
									<Field
										name='lastName'
										placeholder='e.g. Doe'
										className='w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primaryColor-100/20 transition-all outline-none'
									/>
									<ErrorMessage
										name='lastName'
										component='div'
										className='text-red-500 text-xs mt-1 ml-2'
									/>
								</div>

								<div className='md:col-span-2 space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										Email Address
									</label>
									<Field
										name='email'
										type='email'
										placeholder='john@example.com'
										className='w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primaryColor-100/20 transition-all outline-none'
									/>
									<ErrorMessage
										name='email'
										component='div'
										className='text-red-500 text-xs mt-1 ml-2'
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										State
									</label>
									<Select
										options={states}
										value={states.find((o) => o.label === formik.values.state)}
										onChange={handleStateChange}
										placeholder='Select State'
										styles={customSelectStyles}
									/>
									<ErrorMessage
										name='state'
										component='div'
										className='text-red-500 text-xs mt-1 ml-2'
									/>
								</div>

								<div className='space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										City
									</label>
									<Select
										options={citiesForSelectedState}
										value={citiesForSelectedState.find(
											(o) => o.label === formik.values.city,
										)}
										onChange={(opt) => formik.setFieldValue("city", opt?.label)}
										isDisabled={citiesForSelectedState.length === 0}
										placeholder='Select City'
										styles={customSelectStyles}
									/>
									<ErrorMessage
										name='city'
										component='div'
										className='text-red-500 text-xs mt-1 ml-2'
									/>
								</div>

								<div className='md:col-span-2 space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										Street Address
									</label>
									<Field
										name='houseAddress'
										placeholder='House number and street name'
										className='w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primaryColor-100/20 transition-all outline-none'
									/>
									<ErrorMessage
										name='houseAddress'
										component='div'
										className='text-red-500 text-xs mt-1 ml-2'
									/>
								</div>

								{/* Phone Number */}
								<div className='space-y-1'>
									<label className='text-[10px] font-bold uppercase text-slate-400 tracking-widest'>
										Phone Number
									</label>
									<Field
										name='phone'
										className={`w-full border p-4 rounded-xl text-sm focus:ring-2 outline-none transition-all ${
											formik.touched.phone && formik.errors.phone
												? "border-red-500 focus:ring-red-100"
												: "border-slate-200 focus:ring-primary-100/20"
										}`}
									/>
									{formik.touched.phone && formik.errors.phone && (
										<p className='text-[10px] text-red-500 font-bold italic ml-1'>
											{formik.errors.phone as string}
										</p>
									)}
								</div>

								<div className='md:col-span-2 space-y-2'>
									<label className='text-xs font-bold uppercase tracking-widest text-gray-500'>
										Order Notes (Optional)
									</label>
									<Field
										as='textarea'
										name='orderNotes'
										rows={3}
										placeholder='Notes about your delivery...'
										className='w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primaryColor-100/20 transition-all outline-none resize-none'
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='lg:col-span-4'>
						<div className='sticky top-28 space-y-6'>
							{/* Order Summary Card */}
							<div className='bg-white rounded-3xl p-4 lg:p-8 lg:shadow-xl shadow-gray-200/50 lg:border border-gray-100 overflow-hidden relative'>
								<div className='absolute top-0 right-0 w-32 h-32 bg-primaryColor-100/5 rounded-full -mr-16 -mt-16'></div>

								<h3 className='text-lg font-black text-gray-900 mb-6'>
									Order Summary
								</h3>

								<div className='space-y-4 mb-8'>
									<div className='flex justify-between text-sm text-gray-500 font-medium'>
										<span>Subtotal</span>
										<span>
											<FormatMoney2 value={calculateSubtotal()} />
										</span>
									</div>
									<div className='flex justify-between text-sm text-gray-500 font-medium'>
										<span>Shipping</span>
										<span className='text-primaryColor-100'>
											Calculated later
										</span>
									</div>
									<div className='h-[1px] bg-gray-100 w-full my-4'></div>
									<div className='flex justify-between items-center'>
										<span className='text-xs font-black uppercase tracking-widest text-gray-400'>
											Total Payable
										</span>
										<span className='text-2xl font-black text-gray-900'>
											<FormatMoney2 value={calculateSubtotal()} />
										</span>
									</div>
								</div>

								{/* Modern Visual Payment Selector */}
								<div className='mb-8'>
									<label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-4'>
										Payment Method
									</label>
									<RadioGroup
										value={selectedPaymentChannel}
										onChange={setSelectedPaymentChannel}
										className='grid grid-cols-1 gap-3'
									>
										{[
											{
												id: "alliance_pay",
												label: "Alliance Pay",
												sub: "Secure card payment",
											},
											{
												id: "paystack",
												label: "Paystack",
												sub: "Fast & Reliable",
											},
										].map((method) => (
											<RadioGroup.Option
												key={method.id}
												value={method.id}
												className={({ checked }) => `
                                                    relative flex cursor-pointer rounded-2xl px-5 py-4 border-2 transition-all outline-none
                                                    ${checked ? "border-primary-100 bg-primar-100/5" : "border-gray-100 hover:border-gray-200 bg-white"}
                                                `}
											>
												{({ checked }) => (
													<div className='flex w-full items-center justify-between'>
														<div className='flex items-center gap-3'>
															<div>
																<p
																	className={`text-sm font-bold ${checked ? "text-primary-200" : "text-gray-500"}`}
																>
																	{method.label}
																</p>
																<p className='text-[10px] text-gray-700 font-medium'>
																	{method.sub}
																</p>
															</div>
														</div>
														<RiWallet3Line
															className={
																checked ? "text-primary-100" : "text-gray-200"
															}
															size={20}
														/>
													</div>
												)}
											</RadioGroup.Option>
										))}
									</RadioGroup>
									<div className=''>
										<ErrorMessage
											name='firstName'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
										<ErrorMessage
											name='lastName'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
										<ErrorMessage
											name='email'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
										<ErrorMessage
											name='houseAddress'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
										<ErrorMessage
											name='phone'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
										<ErrorMessage
											name='city'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
										<ErrorMessage
											name='state'
											component='div'
											className='text-red-500 text-xs mt-1 ml-2'
										/>
									</div>
								</div>

								{/* Action Button */}
								{selectedPaymentChannel === "alliance_pay" ? (
									<button
										type='button'
										onClick={() => formik.handleSubmit()}
										disabled={encryptedMutation?.isLoading || !formik.isValid}
										className='w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
									>
										{encryptedMutation?.isLoading ? (
											<ClipLoader color='#fff' size={20} />
										) : (
											"Pay Now"
										)}
									</button>
								) : (
									<div className='w-full'>
										{/* Ensure your Paystack component is styled similarly */}
										<PaystackPaymentButton formik={formik} />
									</div>
								)}

								<div className='mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
									<RiShieldCheckFill className='text-green-500' size={14} />
									<span>Encrypted & Secure Payment</span>
								</div>
							</div>
						</div>
					</div>
				</Form>
			</FormikProvider>

			<SignupModal
				isOpen={isModalOpen ? true : false}
				onClose={handleCloseModal}
				setIsOpen={setIsModalOpen}
				content={<AuthModalContent />}
				buttonText='Login'
			/>

			<AuthModal
				isOpen={isPaymentModalOpen}
				onClose={handleClosePaymentModal}
				content={
					<FormikProvider value={paymentFormik}>
						<Form className='flex flex-col xl:flex-row w-full gap-4 mt-3 max-w-[1440px] mx-auto mb-3'>
							<div className='px-2 py-4 slg:p-5 flex-1 flex flex-col gap-4 rounded-xl'>
								<h3 className='text-xs sm:text-base md:text-lg text-primary text-center'>
									Please input card information
								</h3>
								<div className='grid md:grid-cols-2 gap-3 sm:gap-8'>
									{/* Card Number Field */}
									<div>
										<label
											htmlFor='cardNumber'
											className='block font-[500] text-xs sm:text-base text-primary-300 mb-2'
										>
											Card Number <span className='text-red-500'>*</span>
										</label>
										<Field
											type='tel' // Use tel for numeric input
											id='cardNumber'
											name='cardNumber'
											placeholder='Enter card number'
											required
											maxLength={16} // Restrict length for card number
											className={`w-full p-2 sm:py-3 font-[400] text-xs sm:text-base rounded-md border border-secondary-800 outline-none focus:border-secondary-800 transition-[.5] ease-in`}
										/>
										<ErrorMessage
											name={"cardNumber"}
											component={"div"}
											className='text-red-600 text-xs text-left'
										/>
									</div>

									{/* Expiry Month Field */}
									<div>
										<label
											htmlFor='expiryMonth'
											className='block font-[500] text-xs sm:text-base text-primary-300 mb-2'
										>
											Expiry Month <span className='text-red-500'>*</span>
										</label>
										<Field
											type='text'
											id='expiryMonth'
											name='expiryMonth'
											placeholder='MM'
											required
											maxLength={2} // Limit length to 2 digits
											className={`w-full p-2 sm:py-3 font-[400] text-xs sm:text-base rounded-md border border-secondary-800 outline-none focus:border-secondary-800 transition-[.5] ease-in`}
										/>
										<ErrorMessage
											name={"expiryMonth"}
											component={"div"}
											className='text-red-600 text-xs text-left'
										/>
									</div>

									{/* Expiry Year Field */}
									<div>
										<label
											htmlFor='expiryYear'
											className='block font-[500] text-xs sm:text-base text-primary-300 mb-2'
										>
											Expiry Year <span className='text-red-500'>*</span>
										</label>
										<Field
											type='text'
											id='expiryYear'
											name='expiryYear'
											placeholder='YY'
											required
											maxLength={2} // Limit length to 2 digits
											className={`w-full p-2 sm:py-3 font-[400] text-xs sm:text-base rounded-md border border-secondary-800 outline-none focus:border-secondary-800 transition-[.5] ease-in`}
										/>
										<ErrorMessage
											name={"expiryYear"}
											component={"div"}
											className='text-red-600 text-xs text-left'
										/>
									</div>

									{/* CVV Field */}
									<div>
										<label
											htmlFor='cvv'
											className='block font-[500] text-xs sm:text-base text-primary-300 mb-2'
										>
											CVV <span className='text-red-500'>*</span>
										</label>
										<Field
											type='password' // Use password for CVV
											id='cvv'
											name='cvv'
											placeholder='Enter CVV'
											required
											maxLength={4} // CVV can be 3 or 4 digits
											className={`w-full p-2 sm:py-3 font-[400] text-xs sm:text-base rounded-md border border-secondary-800 outline-none focus:border-secondary-800 transition-[.5] ease-in`}
										/>
										<ErrorMessage
											name={"cvv"}
											component={"div"}
											className='text-red-600 text-xs text-left'
										/>
									</div>
								</div>

								<button
									type='submit'
									className={`bg-primary px-8 mt-4 md:px-0 md:w-4/5 max-w-[11rem] py-2 mx-auto text-white rounded-md hover:bg-primaryColor-100 text-xs md:text-base`}
								>
									{payOrderMutation.isLoading ? (
										<ImSpinner2 className='text-xl animate-spin mx-auto' />
									) : (
										"Proceed to Payment"
									)}
								</button>
							</div>
						</Form>
					</FormikProvider>
				}
			/>

			{/* Conditionally render the iframe modal */}
			{iframeUrl && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-md w-11/12 max-w-2xl p-4'>
						<iframe
							src={iframeUrl}
							width='100%'
							height='600px'
							title='Payment'
							className='rounded-md'
						/>
						<button
							onClick={() => {
								emptyCart();
								setIframeUrl(null);
								setIsPaymentModalOpen(false);
							}}
							className='mt-4 bg-red-500 text-white py-1 px-4 rounded'
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};

const customSelectStyles = {
	control: (base: any) => ({
		...base,
		background: "#F9FAFB",
		border: "none",
		borderRadius: "1rem",
		padding: "0.4rem",
		boxShadow: "none",
		"&:hover": { border: "none" },
	}),
	placeholder: (base: any) => ({ ...base, color: "#9CA3AF", fontSize: "14px" }),
	option: (base: any, state: any) => ({
		...base,
		background: state.isSelected
			? "#000"
			: state.isFocused
				? "#F3F4F6"
				: "transparent",
		color: state.isSelected ? "#fff" : "#374151",
		fontSize: "14px",
	}),
};

export default CheckoutInfoForm;

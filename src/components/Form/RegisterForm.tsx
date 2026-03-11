"use client";
import React, { useState } from "react";
import { Form, FormikProvider, useFormik } from "formik";
import { RegisterFormModel } from "../config/models";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY, AUTH_EMAIL } from "@constants";
import Cookies from "js-cookie";
import FormToast from "../Reusables/Toast/SigninToast";
import { ImSpinner2 } from "react-icons/im";
import TextInput from "../Reusables/TextInput";
import axios from "axios";

interface FormValues {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
}

const RegisterForm = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handlePasswordVisibility = () => setShowPassword((p) => !p);

	const formik = useFormik({
		initialValues: {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
		} as FormValues,
		validationSchema: RegisterFormModel,
		onSubmit: async (values, { resetForm }) => {
			setIsLoading(true);
			try {
				// Step 1: create pending user → get verification token
				const step1 = await axios.post("/api/customer/verify-email", {
					name: `${values.first_name.trim()} ${values.last_name.trim()}`,
					email: values.email,
					password: values.password,
				});

				const verificationToken = step1.data?.token;
				if (!verificationToken) {
					FormToast({ message: "Registration failed. Please try again.", success: false });
					return;
				}

				// Step 2: activate account with the verification token
				const step2 = await axios.post(`/api/customer/register/${verificationToken}`);

				const jwtToken = step2.data?.token;
				if (jwtToken) {
					Cookies.set(AUTH_TOKEN_KEY, jwtToken);
					Cookies.set(AUTH_EMAIL, values.email);
					FormToast({ message: "Account created successfully!", success: true });
					resetForm();
					router.push("/");
				} else {
					FormToast({ message: "Account activation failed. Please try again.", success: false });
				}
			} catch (error: any) {
				const message =
					error?.response?.data?.message || "Something went wrong. Please try again.";
				FormToast({ message, success: false });
			} finally {
				setIsLoading(false);
			}
		},
	});

	return (
		<div className='flex flex-col w-full max-w-[32rem] py-5 md:pb-10 px-3 md:px-5 sm:shadow-lg sm:rounded-xl'>
			<h4 className='text-xl md:text-2xl uppercase text-primary-100 font-semibold text-center lg:mb-2'>
				Register
			</h4>
			<FormikProvider value={formik}>
				<Form className='flex flex-col gap-2 md:gap-3'>
					<div className='grid lg:grid-cols-2 gap-2 md:gap-3'>
						<div>
							<label
								htmlFor='first_name'
								className='block text-xs md:text-base text-accent mt-2 mb-1'
							>
								First Name <span className='text-red-500'>*</span>
							</label>
							<TextInput
								id='first_name'
								placeholder='Enter your first name'
								type='text'
								className={`w-full px-2 py-4 text-base rounded-md border bg-transparent border-secondary-800 outline-none transition-[.5] ease-in focus:border-transparent focus:ring-1 focus:ring-primary-100 ${
									formik.touched.first_name && formik.errors.first_name
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
						</div>
						<div>
							<label
								htmlFor='last_name'
								className='block text-xs md:text-base text-accent mt-2 mb-1'
							>
								Last Name <span className='text-red-500'>*</span>
							</label>
							<TextInput
								id='last_name'
								placeholder='Enter your last name'
								type='text'
								className={`w-full px-2 py-4 text-base bg-transparent rounded-md border border-secondary-800 outline-none transition-[.5] ease-in focus:border-transparent focus:ring-1 focus:ring-primary-100 ${
									formik.touched.last_name && formik.errors.last_name
										? "border-red-500"
										: "border-gray-300"
								}`}
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-xs md:text-base text-accent mb-1'
						>
							Email address <span className='text-red-500'>*</span>
						</label>
						<TextInput
							id='email'
							placeholder='Enter your email'
							type='email'
							className={`w-full px-2 py-4 text-base bg-transparent rounded-md border border-secondary-800 outline-none transition-[.5] ease-in focus:border-transparent focus:ring-1 focus:ring-primary-100 ${
								formik.touched.email && formik.errors.email
									? "border-red-500"
									: "border-gray-300"
							}`}
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-xs md:text-base text-accent mb-1'
						>
							Password <span className='text-red-500'>*</span>
						</label>
						<TextInput
							id='password'
							placeholder='Enter your password'
							type={showPassword ? "text" : "password"}
							showPasswordIcon
							showPassword={showPassword}
							togglePasswordVisibility={handlePasswordVisibility}
							passwordIconClassname='text-gray-400 hover:text-gray-600 text-lg'
							className={`w-full px-2 py-4 text-base rounded-md bg-transparent border border-secondary-800 outline-none focus:border-transparent transition-[.5] ease-in focus:ring-1 focus:ring-primary-100 ${
								formik.touched.password && formik.errors.password
									? "border-red-500"
									: "border-gray-300"
							}`}
						/>
					</div>

					<button
						type='submit'
						className={`flex items-center justify-center mt-3 border relative text-white border-transparent text-base leading-[1.4] font-semibold py-2.5 sm:py-3 w-full rounded-md gap-1.5 transition ${
							formik.isValid && !isLoading
								? "bg-primary-100 cursor-pointer"
								: "bg-primary-100/60 cursor-not-allowed"
						}`}
						disabled={!formik.isValid || isLoading}
					>
						{isLoading ? (
							<ImSpinner2 className='text-xl animate-spin' />
						) : (
							"Register"
						)}
					</button>

					<div className='flex justify-center text-sm md:text-base'>
						<span>Already Have account?&nbsp;</span>
						<span
							onClick={() => router.push("/user/login")}
							className='text-primary-100 font-semibold hover:underline cursor-pointer transition underline-offset-4'
						>
							Log in
						</span>
					</div>
				</Form>
			</FormikProvider>
		</div>
	);
};

export default RegisterForm;

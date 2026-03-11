"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../set-up/redux/root-reducer";
import { removeFromCompare, clearCompare, setCompareOpen } from "../Redux/Compare";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { useCart } from "react-use-cart";
import {
	FiX,
	FiStar,
	FiShoppingCart,
	FiCheckCircle,
	FiXCircle,
} from "react-icons/fi";
import Link from "next/link";

const stockLabel: Record<string, { label: string; color: string }> = {
	instock: { label: "In Stock", color: "text-green-600" },
	outofstock: { label: "Out of Stock", color: "text-red-500" },
	onbackorder: { label: "On Backorder", color: "text-yellow-600" },
};

const CompareModal = () => {
	const dispatch = useDispatch();
	const { items } = useSelector((state: RootState) => state.compare);
	const { addItem, getItem } = useCart();

	const onClose = () => dispatch(setCompareOpen(false));

	const handleAddToCart = (product: ProductType) => {
		addItem({
			id: product.id.toString(),
			name: product.name,
			price: parseInt(product.sale_price || product.regular_price || "0"),
			quantity: 1,
			image: product.images?.[0]?.src ?? "",
		});
	};

	const rows: { label: string; render: (p: ProductType) => React.ReactNode }[] = [
		{
			label: "Image",
			render: (p) => (
				<Link href={`/home-item/product/${p.name}-${p.id}`} onClick={onClose}>
					<img
						src={p.images?.[0]?.src ?? ""}
						alt={p.name}
						className='w-24 h-24 object-contain mx-auto'
					/>
				</Link>
			),
		},
		{
			label: "Name",
			render: (p) => (
				<Link
					href={`/home-item/product/${p.name}-${p.id}`}
					onClick={onClose}
					className='text-xs font-black text-slate-800 hover:text-primary-100 transition line-clamp-3'
				>
					{p.name}
				</Link>
			),
		},
		{
			label: "Price",
			render: (p) => {
				const price = parseInt(p.sale_price || p.regular_price || "0");
				const old = parseInt(p.regular_price || "0");
				const onSale = p.sale_price && parseInt(p.sale_price) < old;
				return (
					<div className='flex flex-col items-center gap-0.5'>
						<span className='text-base font-black text-primary-100'>
							<FormatMoney2 value={price} />
						</span>
						{onSale && (
							<span className='text-[10px] text-slate-400 line-through'>
								<FormatMoney2 value={old} />
							</span>
						)}
					</div>
				);
			},
		},
		{
			label: "Rating",
			render: (p) => (
				<div className='flex items-center justify-center gap-1'>
					<FiStar className='fill-yellow-400 text-yellow-400' size={14} />
					<span className='text-xs font-bold text-slate-700'>
						{parseFloat(p.average_rating || "0").toFixed(1)}
					</span>
					<span className='text-[10px] text-slate-400'>({p.rating_count ?? 0})</span>
				</div>
			),
		},
		{
			label: "Availability",
			render: (p) => {
				const s = stockLabel[p.stock_status] ?? { label: p.stock_status, color: "text-slate-500" };
				return (
					<span className={`text-xs font-black flex items-center justify-center gap-1 ${s.color}`}>
						{p.stock_status === "instock" ? (
							<FiCheckCircle size={13} />
						) : (
							<FiXCircle size={13} />
						)}
						{s.label}
					</span>
				);
			},
		},
		{
			label: "SKU",
			render: (p) => (
				<span className='text-[10px] font-mono text-slate-500'>{p.sku || "—"}</span>
			),
		},
		{
			label: "Categories",
			render: (p) => (
				<span className='text-[10px] text-slate-500 text-center'>
					{p.categories?.map((c) => c.name).join(", ") || "—"}
				</span>
			),
		},
		{
			label: "Action",
			render: (p) => {
				const inCart = !!getItem(p.id.toString());
				return (
					<button
						onClick={() => handleAddToCart(p)}
						className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider mx-auto transition ${
							inCart
								? "bg-green-500 text-white"
								: "bg-slate-900 text-white hover:bg-primary-100"
						}`}
					>
						<FiShoppingCart size={12} />
						{inCart ? "In Cart" : "Add to Cart"}
					</button>
				);
			},
		},
	];

	return (
		<div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'>
			{/* Backdrop */}
			<div
				className='absolute inset-0 bg-black/60 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Panel */}
			<div className='relative bg-white w-full max-w-5xl max-h-[90vh] rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col'>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0'>
					<h2 className='text-base font-black text-slate-900 uppercase tracking-tight'>
						Compare Products ({items.length})
					</h2>
					<div className='flex items-center gap-2'>
						<button
							onClick={() => dispatch(clearCompare())}
							className='text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition px-3 py-1.5 rounded-xl border border-slate-200'
						>
							Clear All
						</button>
						<button
							onClick={onClose}
							className='p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 transition'
						>
							<FiX size={18} />
						</button>
					</div>
				</div>

				{/* Table */}
				<div className='overflow-auto flex-1'>
					<table className='w-full min-w-[500px]'>
						<thead className='sticky top-0 bg-slate-50 z-10'>
							<tr>
								{/* Row label column */}
								<th className='w-28 px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100'>
									Feature
								</th>
								{items.map((product) => (
									<th
										key={product.id}
										className='px-4 py-3 text-center border-r border-slate-100 last:border-r-0'
									>
										<div className='flex items-center justify-between'>
											<span className='text-[10px] font-black text-slate-700 truncate max-w-[100px]'>
												{product.name}
											</span>
											<button
												onClick={() => dispatch(removeFromCompare(product.id))}
												className='ml-2 p-1 rounded-full text-slate-300 hover:text-red-400 transition flex-shrink-0'
											>
												<FiX size={12} />
											</button>
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rows.map((row, i) => (
								<tr
									key={row.label}
									className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
								>
									<td className='px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-100 align-middle'>
										{row.label}
									</td>
									{items.map((product) => (
										<td
											key={product.id}
											className='px-4 py-4 text-center border-r border-slate-100 last:border-r-0 align-middle'
										>
											{row.render(product)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default CompareModal;

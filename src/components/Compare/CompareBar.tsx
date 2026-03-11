"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../set-up/redux/root-reducer";
import { removeFromCompare, clearCompare, setCompareOpen } from "../Redux/Compare";
import { FormatMoney2 } from "../Reusables/FormatMoney";
import { FiX, FiBarChart2 } from "react-icons/fi";
import CompareModal from "./CompareModal";

const CompareBar = () => {
	const dispatch = useDispatch();
	const { items, isOpen } = useSelector((state: RootState) => state.compare);

	if (items.length === 0) return null;

	return (
		<>
			{/* Floating Compare Bar */}
			<div className='fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 bg-slate-900 text-white shadow-2xl'>
				<div className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-3'>
					{/* Label */}
					<div className='hidden sm:flex items-center gap-2 mr-2 flex-shrink-0'>
						<FiBarChart2 size={18} className='text-primary-100' />
						<span className='text-xs font-black uppercase tracking-widest'>
							Compare ({items.length}/4)
						</span>
					</div>

					{/* Product Thumbnails */}
					<div className='flex-1 flex items-center gap-2 overflow-x-auto'>
						{items.map((product) => (
							<div
								key={product.id}
								className='flex-shrink-0 flex items-center gap-2 bg-white/10 rounded-xl px-2 py-1.5 group'
							>
								{product.images?.[0]?.src && (
									<img
										src={product.images[0].src}
										alt={product.name}
										className='w-8 h-8 object-contain bg-white rounded-lg p-0.5'
									/>
								)}
								<span className='text-[10px] font-bold max-w-[80px] truncate hidden sm:block'>
									{product.name}
								</span>
								<button
									onClick={() => dispatch(removeFromCompare(product.id))}
									className='text-slate-400 hover:text-white transition p-0.5 flex-shrink-0'
								>
									<FiX size={12} />
								</button>
							</div>
						))}

						{/* Empty slots */}
						{Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
							<div
								key={`empty-${i}`}
								className='flex-shrink-0 w-12 h-11 border border-dashed border-white/20 rounded-xl hidden sm:flex items-center justify-center'
							>
								<span className='text-[10px] text-white/30'>+</span>
							</div>
						))}
					</div>

					{/* Actions */}
					<div className='flex items-center gap-2 flex-shrink-0'>
						<button
							disabled={items.length < 2}
							onClick={() => dispatch(setCompareOpen(true))}
							className='bg-primary-100 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition'
						>
							Compare
						</button>
						<button
							onClick={() => dispatch(clearCompare())}
							className='text-slate-400 hover:text-white transition p-1'
							title='Clear all'
						>
							<FiX size={16} />
						</button>
					</div>
				</div>
			</div>

			{/* Compare Modal */}
			{isOpen && <CompareModal />}
		</>
	);
};

export default CompareBar;

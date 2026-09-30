'use client';

import { X, Check, Sparkles, Zap, Flame, ArrowLeft } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PlanCheckoutModal } from '@/PlanCheckoutModal';
import { cn } from '@/lib/utils';

type contentType = 'default' | 'weekly' | 'monthly' | 'annual';

interface PricingModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
	const [content, setContent] = useState<contentType>('default');

	const dialogRef = useRef<HTMLDialogElement>(null);

	// Sync React state with the Native Dialog API
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	const handleClose = () => {
		setContent('default');
		onClose();
	};

	if (!isOpen) return null;

	return (
		<motion.dialog
			initial={{ opacity: 0, scale: 0.95, y: 20 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{
				type: 'spring',
				damping: 25,
				stiffness: 300,
				opacity: { duration: 0.2 },
			}}
			ref={dialogRef}
			onCancel={handleClose}
			className={cn(
				'flex flex-col bg-white/95 backdrop-blur-xl border border-black/10 fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-4xl p-6 md:p-10 rounded-3xl shadow-2xl backdrop:bg-black/30 transition-all duration-300 focus:outline-none overflow-y-auto max-h-[90vh]',
				content === 'default' ? 'bg-white/95' : 'bg-white',
			)}
		>
			{/* Close Button */}
			<div className="flex flex-row justify-end absolute top-5 right-5 z-10">
				<button
					type="button"
					onClick={handleClose}
					className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:text-black hover:bg-black/5 focus:outline-none transition-all"
					aria-label="Close"
				>
					<X strokeWidth={2} className="h-5 w-5" />
				</button>
			</div>

			{/* Modal Content */}
			{content === 'default' ? (
				<DefaultContent
					toWeekly={() => setContent('weekly')}
					toMonthly={() => setContent('monthly')}
					toAnnual={() => setContent('annual')}
				/>
			) : (
				<>
					<motion.button onClick={() => setContent('default')}>
						<ArrowLeft className="w-4 h-4 text-black/60 transition-transform duration-200 ease-out group-hover:text-black hover:scale-110" />
					</motion.button>
					<PlanCheckoutModal plan={content}></PlanCheckoutModal>
				</>
			)}
		</motion.dialog>
	);
}

/// Different pages of content for modal

// Default (list of subscriptions)

interface ListButtons {
	toWeekly: () => void;
	toMonthly: () => void;
	toAnnual: () => void;
}

function DefaultContent({ toWeekly, toMonthly, toAnnual }: ListButtons) {
	const features = [
		'Unlimited high-quality stencils',
		'Access to all premium styles',
		'Fast generation queue priority',
		'Download stencils with commercial license',
		'Save stencils to your personal gallery',
	];

	return (
		<div className="flex flex-col items-center">
			{/* Header Section */}
			<div className="text-center max-w-lg mb-8 md:mb-10">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
					<Sparkles className="h-3.5 w-3.5" />
					Inkspired Premium
				</div>
				<h2 className="text-2xl md:text-4xl font-extrabold text-black tracking-tight mb-3">
					Unlock Unlimited Creations
				</h2>
				<p className="text-black/60 text-sm md:text-base font-light">
					Get instant access to state-of-the-art AI stencil generation. Choose
					the plan that fits you best.
				</p>
			</div>

			{/* Pricing Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
				{/* Weekly Plan */}
				<div className="relative flex flex-col bg-white border border-black/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex-1 justify-between">
					<div>
						<div className="flex items-center gap-2 mb-4">
							<div className="p-1.5 rounded-lg bg-black/5 text-black/60">
								<Zap className="h-4 w-4" />
							</div>
							<span className="text-xs font-bold text-black/40 uppercase tracking-wider">
								Weekly
							</span>
						</div>

						<div className="mb-4">
							<span className="text-3xl md:text-4xl font-extrabold text-black">
								$3.49
							</span>
							<span className="text-black/50 text-sm font-light"> / week</span>
						</div>

						<p className="text-xs text-black/55 font-light mb-6">
							Perfect for quick, one-off projects and testing ideas.
						</p>

						{/* Features list */}
						<ul className="space-y-3 mb-6">
							{features.map((feature, idx) => (
								<li
									key={idx}
									className="flex items-start gap-2 text-xs font-light text-black/75"
								>
									<Check className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</div>

					<button
						type="button"
						className="w-full py-3 px-4 border border-black/10 hover:border-black/30 bg-black/[0.02] hover:bg-black/5 rounded-2xl text-black font-semibold text-xs transition-all active:scale-[0.98] mt-4"
						onClick={toWeekly}
					>
						Choose Weekly
					</button>
				</div>

				{/* Monthly Plan (Most Popular) */}
				<div className="relative flex flex-col bg-white border-2 border-blue-500 rounded-3xl p-6 shadow-md shadow-blue-500/5 hover:shadow-lg transition-all duration-300 flex-1 justify-between">
					{/* Most Popular Badge */}
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-md shadow-blue-500/10">
						<Flame className="h-3 w-3 fill-current" />
						Most Popular
					</div>

					<div>
						<div className="flex items-center gap-2 mb-4 mt-2">
							<div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
								<Sparkles className="h-4 w-4" />
							</div>
							<span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
								Monthly
							</span>
						</div>

						<div className="mb-4">
							<span className="text-3xl md:text-4xl font-extrabold text-black">
								$4.99
							</span>
							<span className="text-black/50 text-sm font-light"> / month</span>
						</div>

						<p className="text-xs text-black/55 font-light mb-6">
							Great value for regular designers looking for flexibility.
						</p>

						{/* Features list */}
						<ul className="space-y-3 mb-6">
							{features.map((feature, idx) => (
								<li
									key={idx}
									className="flex items-start gap-2 text-xs font-light text-black/75"
								>
									<Check className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</div>

					<button
						type="button"
						className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold text-xs hover:from-blue-600 hover:to-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] mt-4"
						onClick={toMonthly}
					>
						Choose Monthly
					</button>
				</div>

				{/* Annual Plan */}
				<div className="relative flex flex-col bg-white border border-black/10 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex-1 justify-between">
					{/* Savings Badge */}
					<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-green-500/10">
						Save 50%
					</div>

					<div>
						<div className="flex items-center gap-2 mb-4 mt-2">
							<div className="p-1.5 rounded-lg bg-green-50 text-green-600">
								<Check className="h-4 w-4" />
							</div>
							<span className="text-xs font-bold text-green-600 uppercase tracking-wider">
								Annual
							</span>
						</div>

						<div className="mb-2">
							<span className="text-3xl md:text-4xl font-extrabold text-black">
								$29.99
							</span>
							<span className="text-black/50 text-sm font-light"> / year</span>
						</div>

						<div className="text-[10px] text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded-md mb-4">
							Just $2.50 / month
						</div>

						<p className="text-xs text-black/55 font-light mb-6">
							Best value! 50% cheaper compared to monthly plans over a year.
						</p>

						{/* Features list */}
						<ul className="space-y-3 mb-6">
							{features.map((feature, idx) => (
								<li
									key={idx}
									className="flex items-start gap-2 text-xs font-light text-black/75"
								>
									<Check className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</div>

					<button
						type="button"
						className="w-full py-3 px-4 border border-black/10 hover:border-black/30 bg-black/[0.02] hover:bg-black/5 rounded-2xl text-black font-semibold text-xs transition-all active:scale-[0.98] mt-4"
						onClick={toAnnual}
					>
						Choose Annual
					</button>
				</div>
			</div>

			{/* Guarantee / Info Text */}
			<p className="text-[11px] text-black/40 text-center max-w-md font-light leading-relaxed">
				Subscriptions will renew automatically at the selected price and
				interval unless cancelled. You can easily manage or cancel your
				subscription at any time from your Profile settings.
			</p>
		</div>
	);
}

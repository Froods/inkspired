'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CreditsContainerProps {
	credits: number;
}

export default function CreditsContainer({ credits }: CreditsContainerProps) {
	// Normalize credits to a max of 3 (100%) for progress bar width
	const percentage = Math.min(Math.max((credits / 3) * 100, 0), 100);

	return (
		<div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-black/10 shadow-md px-4 py-2.5 rounded-full pointer-events-auto select-none">
			<div className="p-1 rounded-full bg-blue-50 text-blue-600">
				<Sparkles className="h-3.5 w-3.5 fill-current" />
			</div>

			<span className="text-xs font-semibold text-black/80 whitespace-nowrap">
				{credits} {credits === 1 ? 'credit' : 'credits'} left
			</span>

			{/* Progress Bar */}
			<div className="w-16 md:w-20 h-1.5 bg-black/10 rounded-full overflow-hidden">
				<motion.div
					className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ type: 'spring', stiffness: 60, damping: 12 }}
				/>
			</div>
		</div>
	);
}

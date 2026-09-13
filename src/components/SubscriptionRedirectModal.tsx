'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

interface SubscriptionRedirectModalProps {
	isOpen: boolean;
	error?: string | null;
	onErrorDismiss?: () => void;
}

export default function SubscriptionRedirectModal({
	isOpen,
	error,
	onErrorDismiss,
}: SubscriptionRedirectModalProps) {
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
			onCancel={(e) => {
				if (!error) {
					e.preventDefault();
				} else if (onErrorDismiss) {
					onErrorDismiss();
				}
			}}
			className="flex flex-col bg-white border border-black/10 fixed inset-0 z-50 m-auto w-full max-w-[400px] p-8 rounded-3xl shadow-2xl backdrop:bg-black/20 transition-all duration-300 focus:outline-none"
		>
			<div className="flex flex-col items-center mt-4 text-center">
				{error ? (
					<>
						<div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
							<AlertCircle className="w-6 h-6 text-red-600" />
						</div>
						<h2 className="text-xl font-semibold mb-2 text-black">
							Redirection Failed
						</h2>
						<p className="text-black/70 text-sm px-2 mb-6">{error}</p>
						{onErrorDismiss && (
							<button
								onClick={onErrorDismiss}
								className="w-full py-3 px-4 bg-black hover:bg-black/85 text-white rounded-full text-sm font-semibold transition-all active:scale-[0.98]"
							>
								Close
							</button>
						)}
					</>
				) : (
					<>
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-6 mt-4"></div>
						<h2 className="text-xl font-semibold mb-2 text-black">
							Redirecting to subscription portal
						</h2>
						<p className="text-black/50 text-sm px-2">
							Please wait while we securely transfer you to our billing provider.
						</p>
					</>
				)}
			</div>
		</motion.dialog>
	);
}

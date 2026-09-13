'use client';

import { X, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useAuth } from '@/AuthContext';

export default function LoginModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const navigate = useNavigate();
	const { supabase } = useAuth();

	// Sync React state with the Native Dialog API
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			// .showModal() makes the background non-interactive and adds the backdrop
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	// Google Signin function
	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: window.location.origin, // sends user back to "/" after login
			},
		});
	};

	// Facebook Signin function
	const handleFacebookLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'facebook',
			options: {
				redirectTo: window.location.origin, // sends user back to "/" after login
			},
		});
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
			onCancel={onClose}
			className="flex flex-col bg-white border border-black/10 fixed inset-0 z-50 m-auto w-full max-w-[400px] p-8 rounded-3xl shadow-2xl backdrop:bg-black/20 transition-all duration-300 focus:outline-none"
		>
			<div className="flex flex-row justify-end absolute top-4 right-4 z-10">
				<button
					type="button"
					onClick={onClose}
					className="flex h-9 w-9 items-center justify-center rounded-full text-black/60 hover:text-black hover:bg-black/5 focus:outline-none transition-all"
					aria-label="Close"
				>
					<X strokeWidth={2} className="h-5 w-5" />
				</button>
			</div>

			<div className="flex flex-col items-center mt-4">
				<h2 className="text-2xl font-semibold text-center mb-4 text-black">
					Log in or sign up
				</h2>
				<p className="text-center text-black/70 mb-8 text-sm px-2">
					Log in to access the tool or sign up to get free trial tokens
				</p>

				<div className="flex flex-col gap-3 w-full">
					<button
						onClick={handleGoogleLogin}
						className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-black/20 rounded-full hover:bg-black/5 transition-colors text-sm font-medium text-black"
					>
						<svg className="w-5 h-5" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</button>

					<button
						onClick={handleFacebookLogin}
						className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-black/20 rounded-full hover:bg-black/5 transition-colors text-sm font-medium text-black"
					>
						<svg className="w-5 h-5 text-black" viewBox="0 0 320 512">
							<path
								fill="currentColor"
								d="M279.1 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.4 0 225.4 0c-73.22 0-121.1 44.38-121.1 124.7v70.62H22.89V288h81.39v224h100.2V288z"
							/>
						</svg>
						Continue with Facebook
					</button>
				</div>

				<div className="flex items-center w-full my-6">
					<div className="flex-1 border-t border-black/10"></div>
					<span className="px-4 text-xs font-medium text-black/50 uppercase tracking-wider">
						Continue with email
					</span>
					<div className="flex-1 border-t border-black/10"></div>
				</div>

				<div className="w-full flex flex-row gap-3">
					<button
						onClick={() => navigate('/signup')}
						className="flex-1 flex items-center justify-center gap-2 py-3 px-2 border border-black/20 rounded-full hover:bg-black/5 transition-colors text-sm font-medium text-black"
					>
						<Mail className="w-4 h-4" />
						Sign up
					</button>
					<button
						onClick={() => navigate('/login')}
						className="flex-1 flex items-center justify-center gap-2 py-3 px-2 border border-black/20 rounded-full hover:bg-black/5 transition-colors text-sm font-medium text-black"
					>
						<Mail className="w-4 h-4" />
						Log in
					</button>
				</div>
			</div>
		</motion.dialog>
	);
}

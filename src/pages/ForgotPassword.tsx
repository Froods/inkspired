'use client';

import { useState } from 'react';
import { useAuth } from '@/AuthContext';
import { Link } from 'react-router';

export default function ForgotPassword() {
	const { supabase } = useAuth();

	const [email, setEmail] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		});

		setLoading(false);

		if (error) {
			setError(error.message);
		} else {
			setSuccess(true);
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center justify-center relative px-6 py-12 font-sans">
			{/* Logo */}
			<div className="absolute top-8 w-full sm:w-auto text-center sm:text-left sm:left-8">
				<a href="/">
					<h1 className="text-2xl font-bold text-black tracking-tight">
						Inkspired
					</h1>
				</a>
			</div>

			{/* Content */}
			<div className="w-full max-w-[400px] mt-16 sm:mt-0 text-center">
				<h2 className="text-[2.25rem] font-medium text-[#111111] mb-3">
					{success ? 'Check your email' : 'Reset password'}
				</h2>
				<p className="text-[1.05rem] text-[#555555] mb-8 leading-relaxed">
					{success
						? 'A password reset link has been sent to your email.'
						: 'Enter your email address and we\'ll send you a link to reset your password.'}
				</p>

				{!success && (
					<form className="space-y-5" onSubmit={handleSubmit}>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-6 py-[1.1rem] border border-gray-300 rounded-full text-lg placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
						/>

						<button
							disabled={loading}
							type="submit"
							className="w-full py-[1.1rem] px-6 bg-[#111111] hover:bg-black text-white text-lg font-medium rounded-full transition-colors disabled:opacity-55"
						>
							{loading ? 'Sending...' : 'Send reset link'}
						</button>
					</form>
				)}

				<div className="pt-5">
					{error && (
						<p
							className="text-[1.05rem] leading-relaxed mb-4"
							style={{ color: 'red' }}
						>
							{error}
						</p>
					)}
					<p>
						<Link to="/login">
							<u>Back to login</u>
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

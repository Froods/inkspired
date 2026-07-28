'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/AuthContext';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
	const { supabase } = useAuth();
	const navigate = useNavigate();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;
		if (success) {
			timeoutId = setTimeout(() => {
				navigate('/login');
			}, 2500);
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [success, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long.');
			return;
		}

		setLoading(true);

		const { error } = await supabase.auth.updateUser({
			password: password,
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
					{success ? 'Success!' : 'Set new password'}
				</h2>
				<p className="text-[1.05rem] text-[#555555] mb-8 leading-relaxed">
					{success
						? 'Your password has been updated. Redirecting to login page...'
						: 'Please enter and confirm your new password below.'}
				</p>

				{!success && (
					<form className="space-y-5" onSubmit={handleSubmit}>
						<div className="relative w-full">
							<input
								type={showPassword ? 'text' : 'password'}
								id="password"
								name="password"
								placeholder="New password"
								autoComplete="new-password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-6 py-[1.1rem] pr-14 border border-gray-300 rounded-full text-lg placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
							>
								{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>

						<div className="relative w-full">
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								id="confirm-password"
								name="confirm-password"
								placeholder="Confirm password"
								autoComplete="new-password"
								required
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-6 py-[1.1rem] pr-14 border border-gray-300 rounded-full text-lg placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
							>
								{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>

						<button
							disabled={loading}
							type="submit"
							className="w-full py-[1.1rem] px-6 bg-[#111111] hover:bg-black text-white text-lg font-medium rounded-full transition-colors disabled:opacity-55"
						>
							{loading ? 'Saving...' : 'Update password'}
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

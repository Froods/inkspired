'use client';

import { useState } from 'react';
import { useAuth } from '@/AuthContext';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
	const { supabase } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSignup = async () => {
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

		const { data, error } = await supabase.auth.signUp({ email, password });

		setLoading(false);

		if (error?.message === 'Unable to validate email address: invalid format') {
			setError('Invalid email address.');
		} else if (error) {
			setError(error.message);
		} else if (data.user?.identities?.length === 0) {
			// ^ This checks for if an account already exists with the given email
			setError('An account with this email already exists.');
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
					{success ? 'Check your inbox' : 'Sign up with email'}
				</h2>
				<p className="text-[1.05rem] text-[#555555] mb-8 leading-relaxed">
					{success
						? 'A verification link has been sent via email.'
						: "Enter an email and password, and you'll receive a verification link in your inbox."}
				</p>
				{!success && (
					<form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
						<input
							type="email"
							name="Email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-6 py-[1.1rem] border border-gray-300 rounded-full text-lg placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
						/>

						<div className="relative w-full">
							<input
								type={showPassword ? 'text' : 'password'}
								name="Password"
								placeholder="Password"
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
								name="ConfirmPassword"
								placeholder="Confirm Password"
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
							onClick={handleSignup}
							disabled={loading}
							type="submit"
							className="w-full py-[1.1rem] px-6 bg-[#111111] hover:bg-black text-white text-lg font-medium rounded-full transition-colors"
						>
							Sign up
						</button>
					</form>
				)}
				{!success && (
					<div className="pt-3">
						{error && (
							<p
								className="text-[1.05rem] text-[#555555] leading-relaxed"
								style={{ color: 'red' }}
							>
								{error}
							</p>
						)}
						<p>
							Already have an account?<span> </span>
							<Link to="/login">
								<u>Sign in</u>
							</Link>
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

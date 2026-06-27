'use client';

import { useState } from 'react';
import { useAuth } from '@/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
	const { supabase } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setError(null);
		setLoading(true);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		setLoading(false);

		if (error?.message === 'Invalid login credentials') {
			setError('Incorrect email or password.');
		} else if (error) {
			setError(error.message);
		} else {
			navigate('/');
		}
		// On success, Supabase triggers onAuthStateChange in AuthContext,
		// which updates claims automatically. Redirect logic can be added here.
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
					Log in with email
				</h2>
				<p className="text-[1.05rem] text-[#555555] mb-8 leading-relaxed">
					Enter your email and password to log in.
				</p>
				<form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
					<input
						type="email"
						name="Email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-6 py-[1.1rem] border border-gray-300 rounded-full text-lg placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
					/>

					<input
						type="password"
						name="Password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-6 py-[1.1rem] border border-gray-300 rounded-full text-lg placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
					/>

					<button
						onClick={handleLogin}
						disabled={loading}
						type="submit"
						className="w-full py-[1.1rem] px-6 bg-[#111111] hover:bg-black text-white text-lg font-medium rounded-full transition-colors"
					>
						{loading ? 'Logging in...' : 'Log in'}
					</button>
				</form>
				<div className="pt-3">
					{error && (
						<p
							className="text-[1.05rem] leading-relaxed"
							style={{ color: 'red' }}
						>
							{error}
						</p>
					)}
					<p>
						New to inkspired?<span> </span>
						<Link to="/signup">
							<u>Create an account</u>
						</Link>
					</p>
					<p className="mt-2">
						<Link to="/forgot-password">
							<u>Forgot password?</u>
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

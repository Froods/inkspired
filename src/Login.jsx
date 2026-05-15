import './index.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [claims, setClaims] = useState(null);
	const [authError, setAuthError] = useState(null);
	const [isSignUp, setIsSignUp] = useState(false);

	const params = new URLSearchParams(window.location.search);
	const hasTokenHash = params.get('token_hash');

	const [verifying, setVerifying] = useState(!!hasTokenHash);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token_hash = params.get('token_hash');
		const type = params.get('type');

		if (token_hash) {
			supabase.auth
				.verifyOtp({ token_hash, type: type || 'email' })
				.then(({ error }) => {
					if (error) {
						setAuthError(error.message);
					} else {
						window.history.replaceState({}, document.title, '/');
					}
					setVerifying(false);
				});
		}

		// Check for existing session
		supabase.auth.getClaims().then(({ data: { claims } }) => {
			setClaims(claims);
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(() => {
			supabase.auth.getClaims().then(({ data: { claims } }) => {
				setClaims(claims);
			});
		});

		return () => subscription.unsubscribe();
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();
		setLoading(true);
		setAuthError(null);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setAuthError(error.message);
		}

		setLoading(false);
	};

	const handleSignUp = async (event) => {
		event.preventDefault();
		setLoading(true);
		setAuthError(null);

		const { error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			setAuthError(error.message);
		} else {
			alert('Tjek din email for at bekræfte din konto!');
		}

		setLoading(false);
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setClaims(null);
	};

	// Hvis brugeren er logget ind
	if (claims) {
		return (
			<div>
				<h1>Welcome!</h1>
				<p>You are logged in as: {claims.email}</p>
				<button onClick={handleLogout}>Sign Out</button>
			</div>
		);
	}

	if (verifying) {
		return (
			<div>
				<h1>Authentication</h1>
				<p>Bekræfter din email...</p>
			</div>
		);
	}

	// Login / opret konto formular
	return (
		<div>
			<h1>Supabase + React</h1>
			<p>{isSignUp ? 'Opret en ny konto' : 'Log ind med email og kode'}</p>

			{authError && <p style={{ color: 'red' }}>{authError}</p>}

			<form onSubmit={isSignUp ? handleSignUp : handleLogin}>
				<input
					type="email"
					placeholder="Din email"
					value={email}
					required={true}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Din adgangskode"
					value={password}
					required={true}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button disabled={loading}>
					{loading ? (
						<span>Loading...</span>
					) : (
						<span>{isSignUp ? 'Opret konto' : 'Log ind'}</span>
					)}
				</button>
			</form>

			<button
				onClick={() => {
					setIsSignUp(!isSignUp);
					setAuthError(null);
				}}
			>
				{isSignUp
					? 'Har du allerede en konto? Log ind'
					: 'Ingen konto? Opret en her'}
			</button>
		</div>
	);
}

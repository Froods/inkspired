import { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';

// Typen for claims-objektet fra Supabase
interface Claims {
	[key: string]: unknown;
}

// Typen for hvad AuthContext eksponerer
interface AuthContextType {
	claims: Claims | null;
	supabase: SupabaseClient;
}

// Opretter selve "beholderen" som data kan lægges i
const AuthContext = createContext<AuthContextType | null>(null);

// Opretter Supabase-klienten ét centralt sted
const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL as string,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
);

// AuthProvider er en komponent der omslutter hele din app
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [claims, setClaims] = useState<Claims | null>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		supabase.auth.getClaims().then(({ data: { claims } }) => setClaims(claims));

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event) => {
			supabase.auth
				.getClaims()
				.then(({ data: { claims } }) => setClaims(claims));

			if (event === 'SIGNED_IN' && location.pathname === '/login') {
				navigate('/');
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	// Alt inden i "value" er hvad andre sider/komponenter kan tilgå
	return (
		<AuthContext.Provider value={{ claims, supabase }}>
			{children}
		</AuthContext.Provider>
	);
}

// En hjælpefunktion så man nemt kan hente Context-data
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth skal bruges inden i en AuthProvider');
	return context;
};

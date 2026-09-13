// PlanCheckoutModal.tsx
import { loadStripe } from '@stripe/stripe-js';
import {
	EmbeddedCheckoutProvider,
	EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useCallback, useState } from 'react';
import { useAuth } from './AuthContext';

const stripePromise = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);

type Plan = 'weekly' | 'monthly' | 'annual';

export function PlanCheckoutModal({ plan }: { plan: Plan }) {
	const { supabase } = useAuth();
	const [error, setError] = useState<string | null>(null);

	const fetchClientSecret = useCallback(async () => {
		const { data, error: fnError } = await supabase.functions.invoke(
			'create-checkout-session',
			{
				body: { plan },
			},
		);

		if (fnError || !data?.clientSecret) {
			setError('Could not start checkout');
			throw fnError ?? new Error('No client secret returned');
		}

		return data.clientSecret as string;
	}, [plan, supabase]);

	return (
		<div className="modal-content" onClick={(e) => e.stopPropagation()}>
			{error && <p>{error}</p>}
			<EmbeddedCheckoutProvider
				stripe={stripePromise}
				options={{ fetchClientSecret }}
			>
				<EmbeddedCheckout />
			</EmbeddedCheckoutProvider>
		</div>
	);
}

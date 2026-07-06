import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore: Vanta.js does not have official TypeScript definitions
import FOG from 'vanta/dist/vanta.fog.min';

interface BackgroundProps {
	children?: React.ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
	const vantaRef = useRef<HTMLDivElement>(null);
	const vantaEffectRef = useRef<any>(null);

	useEffect(() => {
		// Initialize the Vanta effect only if it hasn't been initialized yet
		if (!vantaEffectRef.current && vantaRef.current) {
			vantaEffectRef.current = FOG({
				el: vantaRef.current,
				THREE: THREE, // You must explicitly pass the THREE object
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
				minHeight: 200.0,
				minWidth: 200.0,
				// Colors and settings
				highlightColor: 0xc7e7ff,
				midtoneColor: 0xfff8db,
				lowlightColor: 0xffaaaa,
				baseColor: 0xffffff,
				blurFactor: 0.9,
				zoom: 0.275,
				speed: 1.0,
			});
		}

		// Cleanup function to destroy the effect when the component unmounts
		return () => {
			if (vantaEffectRef.current) {
				vantaEffectRef.current.destroy();
				vantaEffectRef.current = null;
			}
		};
	}, []);

	return (
		<>
			<div
				ref={vantaRef}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					zIndex: -1,
				}}
			/>
			{children}
		</>
	);
};

export default Background;

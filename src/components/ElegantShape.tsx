import { motion, number } from 'framer-motion';
import { cn } from '@/lib/utils';
import skullImage from '../assets/skull.png';
import rose from '../assets/rose.png';
import bird from '../assets/bird.png';
import compas from '../assets/compas.png';
import shark from '../assets/shark.png';

/**
 * ElegantShape Component
 *
 * This component renders a floating, animated shape with a gradient and blur effect.
 * It uses framer-motion for entrance and floating animations.
 *
 * @param className - Additional classes to apply to the container
 * @param delay - Delay before the entrance animation starts
 * @param width - Width of the shape
 * @param height - Height of the shape
 * @param rotate - Rotation of the shape in degrees
 * @param gradient - Tailwind gradient classes for the shape
 * @param illustration - Illustration to display
 */
export function ElegantShape({
	className,
	delay = 0,
	width = 400,
	height = 100,
	rotate = 0,
	illustration = 1,
}: {
	className?: string;
	delay?: number;
	width?: number;
	height?: number;
	rotate?: number;
	illustration?: number;
}) {
	let illustrationImage: string = skullImage;

	if (illustration === 1) {
		illustrationImage = skullImage;
	} else if (illustration === 2) {
		illustrationImage = rose;
	} else if (illustration === 3) {
		illustrationImage = bird;
	} else if (illustration === 4) {
		illustrationImage = compas;
	} else if (illustration === 5) {
		illustrationImage = shark;
	}

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: -150,
				rotate: rotate - 15,
			}}
			animate={{
				opacity: 1,
				y: 0,
				rotate: rotate,
			}}
			transition={{
				duration: 2.4,
				delay,
				ease: [0.23, 0.86, 0.39, 0.96],
				opacity: { duration: 1.2 },
			}}
			className={cn('absolute', className)}
		>
			<motion.div
				animate={{
					y: [0, 15, 0],
				}}
				transition={{
					duration: 12,
					repeat: Number.POSITIVE_INFINITY,
					ease: 'easeInOut',
				}}
				style={{
					width,
					height,
				}}
				className="relative"
			>
				<div
					className="absolute inset-0"
					style={{
						backgroundImage: `url(${illustrationImage})`,
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center',
						filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))', // White glow
					}}
				></div>
			</motion.div>
		</motion.div>
	);
}

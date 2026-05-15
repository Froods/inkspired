import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type TattooStyle = 'Traditional' | 'Neo-Traditional' | 'Blackwork';

interface StyleDropdownProps {
	isOpen: boolean;
	onClose: () => void;
	selectedStyle: TattooStyle | null;
	onSelect: (style: TattooStyle) => void;
}

const styles: TattooStyle[] = ['Traditional', 'Neo-Traditional', 'Blackwork'];

export default function StyleDropdown({
	isOpen,
	onClose,
	selectedStyle,
	onSelect,
}: StyleDropdownProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Invisible backdrop to catch outside clicks */}
					<div className="fixed inset-0 z-40" onClick={onClose} />
					
					{/* Dropdown Menu */}
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="absolute bottom-full left-0 mb-2 w-48 bg-white/90 backdrop-blur-xl border border-black/10 shadow-2xl rounded-2xl p-2 z-50 origin-bottom-left"
					>
						<div className="flex flex-col gap-1">
							<div className="px-2 pb-1 pt-1 text-[10px] font-bold text-black/40 uppercase tracking-widest">
								Select Style
							</div>
							{styles.map((style) => (
								<button
									key={style}
									onClick={() => {
										onSelect(style);
										onClose();
									}}
									className={cn(
										'flex items-center justify-between w-full px-3 py-2 text-sm rounded-xl transition-all',
										selectedStyle === style
											? 'bg-blue-50 text-blue-600 font-medium'
											: 'text-black/70 hover:bg-black/5 hover:text-black font-medium'
									)}
								>
									{style}
									{selectedStyle === style && <Check className="w-4 h-4 text-blue-600" />}
								</button>
							))}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

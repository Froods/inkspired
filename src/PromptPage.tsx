'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Sparkles, Send, Mic, Image as ImageIcon, Zap } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

function ElegantShape({
	className,
	delay = 0,
	width = 400,
	height = 100,
	rotate = 0,
	gradient = 'from-white/[0.08]',
}: {
	className?: string;
	delay?: number;
	width?: number;
	height?: number;
	rotate?: number;
	gradient?: string;
}) {
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
					className={cn(
						'absolute inset-0 rounded-full',
						'bg-gradient-to-r to-transparent',
						gradient,
						'backdrop-blur-[2px] border-2 border-white/[0.15]',
						'shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]',
						'after:absolute after:inset-0 after:rounded-full',
						'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]',
					)}
				/>
			</motion.div>
		</motion.div>
	);
}

interface PromptInputProps {
	onSend?: (message: string) => void;
	placeholder?: string;
}

function PromptInput({
	onSend = () => {},
	placeholder = 'Describe your dream tattoo...',
}: PromptInputProps) {
	const [input, setInput] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleSubmit = () => {
		if (input.trim()) {
			onSend(input);
			setInput('');
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
		}
	}, [input]);

	const hasContent = input.trim() !== '';

	return (
		<div className="w-full max-w-4xl mx-auto">
			<div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/50 transition-all duration-300">
				<div className="relative">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className="w-full px-6 py-5 bg-transparent border-none outline-none resize-none text-white text-base leading-relaxed placeholder:text-white/40 min-h-[60px] max-h-[200px]"
						style={{ overflow: 'hidden' }}
					/>
				</div>

				<div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
						>
							<ImageIcon className="h-5 w-5" />
						</button>
						<button
							type="button"
							className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
						>
							<Mic className="h-5 w-5" />
						</button>
					</div>

					<button
						onClick={handleSubmit}
						disabled={!hasContent}
						className={cn(
							'flex h-9 w-9 items-center justify-center rounded-full transition-all',
							hasContent
								? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
								: 'bg-white/10 text-white/40 cursor-not-allowed',
						)}
					>
						<Send className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
				<QuickPrompt
					icon={<Sparkles className="w-4 h-4" />}
					label="Minimalist Design"
				/>
				<QuickPrompt icon={<Zap className="w-4 h-4" />} label="Bold & Edgy" />
				<QuickPrompt
					icon={<ImageIcon className="w-4 h-4" />}
					label="Traditional Style"
				/>
			</div>
		</div>
	);
}

function QuickPrompt({
	icon,
	label,
}: {
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm">
			{icon}
			<span>{label}</span>
		</button>
	);
}

export default function PromptPage() {
	const fadeUpVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
				delay: 0.5 + i * 0.2,
				ease: [0.25, 0.4, 0.25, 1],
			},
		}),
	};

	return (
		<div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
			<div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-pink-500/[0.05] blur-3xl" />

			<div className="absolute inset-0 overflow-hidden">
				<ElegantShape
					delay={0.3}
					width={600}
					height={140}
					rotate={12}
					gradient="from-purple-500/[0.15]"
					className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
				/>

				<ElegantShape
					delay={0.5}
					width={500}
					height={120}
					rotate={-15}
					gradient="from-pink-500/[0.15]"
					className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
				/>

				<ElegantShape
					delay={0.4}
					width={300}
					height={80}
					rotate={-8}
					gradient="from-violet-500/[0.15]"
					className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
				/>

				<ElegantShape
					delay={0.6}
					width={200}
					height={60}
					rotate={20}
					gradient="from-fuchsia-500/[0.15]"
					className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
				/>
			</div>

			<div className="relative z-10 container mx-auto px-4 md:px-6">
				<div className="max-w-5xl mx-auto text-center">
					<motion.div
						custom={0}
						variants={fadeUpVariants}
						initial="hidden"
						animate="visible"
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
					>
						<Sparkles className="h-4 w-4 text-purple-400" />
						<span className="text-sm text-white/60 tracking-wide">
							AI-Powered Tattoo Design
						</span>
					</motion.div>

					<motion.div
						custom={1}
						variants={fadeUpVariants}
						initial="hidden"
						animate="visible"
					>
						<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
							<span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
								Your Next Tattoo,
							</span>
							<br />
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400">
								Designed by AI
							</span>
						</h1>
					</motion.div>

					<motion.div
						custom={2}
						variants={fadeUpVariants}
						initial="hidden"
						animate="visible"
					>
						<p className="text-base sm:text-lg md:text-xl text-white/40 mb-12 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
							Transform your ideas into unique tattoo designs. Describe your
							vision, and our AI creates custom artwork tailored to your style.
						</p>
					</motion.div>

					<motion.div
						custom={3}
						variants={fadeUpVariants}
						initial="hidden"
						animate="visible"
					>
						<PromptInput />
					</motion.div>

					<motion.div
						custom={4}
						variants={fadeUpVariants}
						initial="hidden"
						animate="visible"
						className="mt-12 flex items-center justify-center gap-8 text-sm text-white/40"
					>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-green-500" />
							<span>10k+ Designs Created</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-purple-500" />
							<span>100% Unique</span>
						</div>
					</motion.div>
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
		</div>
	);
}

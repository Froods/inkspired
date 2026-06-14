import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Paintbrush, Image } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/AuthContext';
import logo from '@/assets/inkspired-logo-slim.svg';

interface SidebarProps {
	onLoginClick: () => void;
}

export default function Sidebar({ onLoginClick }: SidebarProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { claims, supabase } = useAuth();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleProfileClick = () => {
		if (!claims) {
			onLoginClick();
		} else {
			setIsDropdownOpen(!isDropdownOpen);
		}
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		setIsDropdownOpen(false);
	};

	return (
		<motion.div
			animate={{ width: isExpanded ? 260 : 88 }}
			transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
			className="absolute top-0 left-0 h-full bg-white/60 backdrop-blur-xl border-r border-black/10 z-50 flex flex-col py-6 shadow-sm overflow-visible"
		>
			{/* Top Logo / Toggle */}
			<div className="flex items-center px-4 h-16">
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex-shrink-0 p-2 hover:bg-black/5 rounded-full transition-colors group flex items-center justify-center w-14 h-14"
					title="Toggle Menu"
				>
					<img
						src={logo}
						alt="Inkspired Logo"
						className="h-10 w-auto transition-transform group-hover:scale-105"
					/>
				</button>
				<AnimatePresence>
					{isExpanded && (
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{
								opacity: 1,
								x: 0,
								transition: { duration: 0.2, delay: 0.1 },
							}}
							exit={{ opacity: 0, transition: { duration: 0 } }}
							className="ml-3 font-semibold text-xl tracking-tight text-black whitespace-nowrap"
						>
							Inkspired
						</motion.span>
					)}
				</AnimatePresence>
			</div>

			{/* Navigation Tabs */}
			<div className="flex-1 mt-8 px-4 flex flex-col gap-2">
				<Link
					to="/"
					className={cn(
						'flex items-center w-full p-3 rounded-2xl transition-all gap-3 justify-start font-medium text-sm',
						location.pathname === '/'
							? 'bg-blue-50 text-blue-600'
							: 'text-black/60 hover:text-black hover:bg-black/5'
					)}
					title="Create Stencil"
				>
					<Paintbrush className={cn('h-5 w-5 shrink-0', location.pathname === '/' ? 'text-blue-600' : 'text-black/60')} />
					<AnimatePresence>
						{isExpanded && (
							<motion.span
								initial={{ opacity: 0, x: -10 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { duration: 0.2, delay: 0.1 },
								}}
								exit={{ opacity: 0, transition: { duration: 0 } }}
								className="whitespace-nowrap"
							>
								Create
							</motion.span>
						)}
					</AnimatePresence>
				</Link>

				<Link
					to="/gallery"
					className={cn(
						'flex items-center w-full p-3 rounded-2xl transition-all gap-3 justify-start font-medium text-sm',
						location.pathname === '/gallery'
							? 'bg-blue-50 text-blue-600'
							: 'text-black/60 hover:text-black hover:bg-black/5'
					)}
					title="My Gallery"
				>
					<Image className={cn('h-5 w-5 shrink-0', location.pathname === '/gallery' ? 'text-blue-600' : 'text-black/60')} />
					<AnimatePresence>
						{isExpanded && (
							<motion.span
								initial={{ opacity: 0, x: -10 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { duration: 0.2, delay: 0.1 },
								}}
								exit={{ opacity: 0, transition: { duration: 0 } }}
								className="whitespace-nowrap"
							>
								Gallery
							</motion.span>
						)}
					</AnimatePresence>
				</Link>
			</div>

			{/* Bottom Profile Button */}
			<div className="px-4 relative" ref={dropdownRef}>
				<AnimatePresence>
					{isDropdownOpen && claims && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ duration: 0.2 }}
							className={cn(
								'absolute bottom-full mb-2 left-4 bg-white border border-black/10 shadow-lg rounded-2xl overflow-hidden flex flex-col',
								isExpanded ? 'w-[calc(100%-2rem)]' : 'w-48',
							)}
						>
							<button
								onClick={handleLogout}
								className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors text-black/80 font-medium text-sm text-left"
							>
								<LogOut className="h-4 w-4" />
								Log out
							</button>
						</motion.div>
					)}
				</AnimatePresence>

				<button
					onClick={handleProfileClick}
					className="flex items-center w-full p-2 rounded-full hover:bg-black/5 transition-colors justify-start"
					title={claims ? 'Profile' : 'Login'}
				>
					<div className="h-10 w-10 rounded-full bg-black/5 border border-black/10 flex items-center justify-center shrink-0 overflow-hidden">
						{claims ? (
							<User className="h-5 w-5 text-black/60" />
						) : (
							<User className="h-5 w-5 text-black/40" />
						)}
					</div>
					<AnimatePresence>
						{isExpanded && (
							<motion.div
								initial={{ opacity: 0, x: -10 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { duration: 0.2, delay: 0.1 },
								}}
								exit={{ opacity: 0, transition: { duration: 0 } }}
								className="ml-3 flex flex-col items-start whitespace-nowrap"
							>
								<span className="font-medium text-black/80 text-sm">
									{claims ? 'My Profile' : 'Login'}
								</span>
								{!claims && (
									<span className="text-xs text-black/40">Sign in to save</span>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				</button>
			</div>
		</motion.div>
	);
}

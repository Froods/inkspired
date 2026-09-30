'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	Calendar,
	Download,
	Maximize2,
	Paintbrush,
	X,
	Lock,
	Sparkles,
	ArrowRight,
	Image as ImageIcon,
	Clock,
} from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '@/AuthContext';
import Sidebar from '@/components/Sidebar';
import LoginModal from '@/components/LoginModal';
import Background from '@/components/Background';

interface GeneratedImage {
	id: string;
	user_id: string;
	storage_path: string;
	prompt: string;
	style: string;
	created_at: string;
	delete_at?: string | null;
}

export default function Gallery() {
	const { claims, supabase } = useAuth();
	const [images, setImages] = useState<GeneratedImage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
		null,
	);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [downloadingId, setDownloadingId] = useState<string | null>(null);
	const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!claims) {
			setLoading(false);
			return;
		}

		async function fetchImages() {
			try {
				setLoading(true);
				setError(null);

				// The user ID matches claims.sub in Supabase JWT
				const userId = claims?.sub as string;
				if (!userId) {
					throw new Error('User ID could not be identified from session.');
				}

				const { data, error: dbError } = await supabase
					.from('generated_images')
					.select('*')
					.eq('user_id', userId)
					.order('created_at', { ascending: false });

				if (dbError) throw dbError;
				setImages(data || []);
			} catch (err: unknown) {
				console.error('Error fetching gallery images:', err);
				const message =
					err instanceof Error ? err.message : 'Failed to load gallery images';
				setError(message);
			} finally {
				setLoading(false);
			}
		}

		fetchImages();
	}, [claims, supabase]);

	// Fetch signed URLs for all loaded images in bulk
	useEffect(() => {
		if (images.length === 0) return;

		async function getSignedUrls() {
			try {
				const paths = images.map((img) => img.storage_path);
				const { data, error: err } = await supabase.storage
					.from('tattoo-images')
					.createSignedUrls(paths, 3600);

				if (err) {
					console.error('Error creating signed URLs:', err);
					return;
				}

				const urlMap: Record<string, string> = {};
				data?.forEach((item) => {
					if (item.path && item.signedUrl) {
						urlMap[item.path] = item.signedUrl;
					}
				});
				setSignedUrls(urlMap);
			} catch (err) {
				console.error('Failed to generate signed URLs:', err);
			}
		}

		getSignedUrls();
	}, [images, supabase]);

	// Helper to get public or signed URL of the tattoo image from the 'tattoo-images' bucket
	const getImageUrl = (storagePath: string) => {
		if (signedUrls[storagePath]) {
			return signedUrls[storagePath];
		}
		const { data } = supabase.storage
			.from('tattoo-images')
			.getPublicUrl(storagePath);
		return data.publicUrl;
	};

	// Clean date formatter
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch {
			return dateString;
		}
	};

	// Calculates days remaining until stencil deletion
	const getDaysUntilDeletionText = (deleteAtString: string) => {
		const deleteDate = new Date(deleteAtString);
		const now = new Date();
		const diffTime = deleteDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays <= 0) {
			return 'Deleting today';
		} else if (diffDays === 1) {
			return 'Deleting tomorrow';
		} else {
			return `Deletes in ${diffDays} days`;
		}
	};

	// Safe image downloader that forces browser file download
	const handleDownload = async (
		e: React.MouseEvent,
		storagePath: string,
		prompt: string,
		id: string,
	) => {
		e.stopPropagation(); // Avoid triggering open lightbox modal
		const imageUrl = getImageUrl(storagePath);

		try {
			setDownloadingId(id);
			const response = await fetch(imageUrl);
			if (!response.ok) throw new Error('Network response was not ok');
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;

			// Generate friendly filename
			const cleanName = prompt
				.replace(/[^a-z0-9]/gi, '_')
				.toLowerCase()
				.slice(0, 30);
			link.download = `inkspired-${cleanName || 'tattoo'}.jpg`;

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to download image:', err);
			// Fallback: open in new tab
			window.open(imageUrl, '_blank');
		} finally {
			setDownloadingId(null);
		}
	};

	// Stagger container animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.08,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
		},
	};

	return (
		<Background>
			<div className="relative min-h-screen w-full flex bg-transparent font-sans overflow-x-hidden select-none">
				{/* Persistent Navigation Sidebar */}
				<Sidebar onLoginClick={() => setIsLoginModalOpen(true)} />

				{/* Page Content Container */}
				<div className="flex-1 min-h-screen pl-24 md:pl-28 pr-6 md:pr-12 py-12 relative z-10 flex flex-col">
					<div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
						{/* Header section */}
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-black/5 pb-8">
							<div>
								<h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black">
									My Gallery
								</h1>
								<p className="text-sm md:text-base text-black/50 mt-2 font-light">
									Browse and manage your custom AI-generated tattoo stencils.
								</p>
							</div>

							{claims && images.length > 0 && (
								<div className="flex items-center gap-2 text-xs md:text-sm text-black/45 bg-black/[0.02] border border-black/5 rounded-full px-4 py-2 self-start md:self-auto">
									<ImageIcon className="w-4 h-4 text-black/60" />
									<span>
										{images.length} design{images.length === 1 ? '' : 's'}{' '}
										created
									</span>
								</div>
							)}
						</div>

						{/* Content Conditional States */}
						{!claims ? (
							/* --- LOGGED OUT VIEW --- */
							<div className="flex-1 flex items-center justify-center py-12">
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className="max-w-md w-full bg-white/40 backdrop-blur-xl border border-black/10 p-8 rounded-3xl text-center shadow-xl shadow-black/[0.02] flex flex-col items-center"
								>
									<div className="w-16 h-16 rounded-3xl bg-black/[0.03] border border-black/5 flex items-center justify-center mb-6">
										<Lock className="w-6 h-6 text-black/60" />
									</div>

									<h2 className="text-2xl font-semibold text-black tracking-tight mb-3">
										Unlock Your Gallery
									</h2>
									<p className="text-black/60 text-sm leading-relaxed mb-8 font-light">
										Sign in to view your private collection of generated
										stencils, download previous creations, and manage your
										custom artwork.
									</p>

									<button
										onClick={() => setIsLoginModalOpen(true)}
										className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-500/90 text-white rounded-full text-sm font-semibold hover:from-blue-600 hover:to-blue-600/90 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
									>
										Log in or sign up
										<ArrowRight className="w-4 h-4" />
									</button>
								</motion.div>
							</div>
						) : loading ? (
							/* --- LOADING VIEW --- */
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{Array.from({ length: 8 }).map((_, idx) => (
									<div
										key={idx}
										className="bg-white border border-black/5 rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse"
									>
										<div className="aspect-square bg-black/5 w-full" />
										<div className="p-5 flex-1 flex flex-col justify-between gap-3">
											<div className="space-y-2">
												<div className="h-4 bg-black/5 rounded-md w-3/4" />
												<div className="h-4 bg-black/5 rounded-md w-1/2" />
											</div>
											<div className="flex justify-between items-center mt-2">
												<div className="h-5 bg-black/5 rounded-full w-20" />
												<div className="h-3 bg-black/5 rounded-md w-16" />
											</div>
										</div>
									</div>
								))}
							</div>
						) : error ? (
							/* --- ERROR VIEW --- */
							<div className="flex-1 flex items-center justify-center py-12">
								<div className="max-w-md p-6 bg-red-50/50 border border-red-100 rounded-2xl text-center">
									<p className="text-red-600 text-sm font-medium">{error}</p>
									<button
										onClick={() => window.location.reload()}
										className="mt-4 text-xs font-semibold text-blue-500 hover:underline"
									>
										Try Again
									</button>
								</div>
							</div>
						) : images.length === 0 ? (
							/* --- EMPTY VIEW --- */
							<div className="flex-1 flex items-center justify-center py-12">
								<motion.div
									initial={{ opacity: 0, y: 15 }}
									animate={{ opacity: 1, y: 0 }}
									className="max-w-md text-center flex flex-col items-center"
								>
									<div className="w-16 h-16 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex items-center justify-center mb-6">
										<Sparkles className="w-6 h-6 text-blue-500" />
									</div>

									<h2 className="text-xl font-bold text-black mb-2 tracking-tight">
										No Tattoo Designs Yet
									</h2>
									<p className="text-black/55 text-sm leading-relaxed mb-6 font-light max-w-sm">
										Describe your dream tattoo, select a style, and our AI
										tattoo generator will create custom high-quality stencils
										for you.
									</p>

									<Link
										to="/"
										className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white hover:bg-black/85 rounded-full text-xs font-semibold transition-all active:scale-[0.98]"
									>
										Generate Stencil
										<Paintbrush className="w-3.5 h-3.5" />
									</Link>
								</motion.div>
							</div>
						) : (
							/* --- GRID OF STENCILS --- */
							<motion.div
								variants={containerVariants}
								initial="hidden"
								animate="show"
								className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
							>
								{images.map((image) => {
									const imageUrl = getImageUrl(image.storage_path);
									return (
										<motion.div
											key={image.id}
											variants={itemVariants}
											onClick={() => setSelectedImage(image)}
											className="group bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-black/15 transition-all duration-200 flex flex-col cursor-pointer"
										>
											{/* Image Container */}
											<div className="relative aspect-square overflow-hidden bg-black/[0.02] border-b border-black/5">
												<img
													src={imageUrl}
													alt={image.prompt}
													loading="lazy"
													className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
												/>

												{/* Hover Action Overlay */}
												<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-4">
													<button
														type="button"
														className="p-2.5 bg-white/20 hover:bg-white/40 text-white  rounded-full border border-white/20 transition-all transform translate-y-2 group-hover:translate-y-0 duration-200"
														title="Quick View"
													>
														<Maximize2 className="w-4 h-4" />
													</button>
													<button
														type="button"
														disabled={downloadingId === image.id}
														onClick={(e) =>
															handleDownload(
																e,
																image.storage_path,
																image.prompt,
																image.id,
															)
														}
														className="p-2.5 bg-white text-black hover:bg-white/95 rounded-full shadow-lg transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 flex items-center justify-center"
														title="Download Stencil"
													>
														{downloadingId === image.id ? (
															<div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
														) : (
															<Download className="w-4 h-4" />
														)}
													</button>
												</div>
											</div>

											{/* Details text */}
											<div className="p-5 flex-1 flex flex-col justify-between gap-4">
												<p
													className="text-sm font-semibold text-black leading-snug line-clamp-2 tracking-tight select-text"
													onClick={(e) => e.stopPropagation()} // Allow copy text
												>
													{image.prompt}
												</p>

												<div className="flex items-center justify-between mt-auto">
													<span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
														{image.style}
													</span>

													<span className="text-[11px] text-black/40 flex items-center gap-1 font-light">
														<Calendar className="w-3 h-3 text-black/35" />
														{formatDate(image.created_at)}
													</span>
												</div>
											</div>
										</motion.div>
									);
								})}
							</motion.div>
						)}
					</div>
				</div>

				{/* Lightbox / Modal for details */}
				<AnimatePresence>
					{selectedImage && (
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
							{/* Backdrop */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								onClick={() => setSelectedImage(null)}
								className="absolute inset-0 bg-black/60 backdrop-blur-md"
							/>

							{/* Modal Box */}
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 15 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 15 }}
								transition={{ type: 'spring', damping: 25, stiffness: 350 }}
								className="bg-white w-full max-w-4xl border border-black/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[85vh] md:max-h-[70vh]"
							>
								{/* Close Button */}
								<button
									onClick={() => setSelectedImage(null)}
									className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 md:bg-black/5 md:hover:bg-black/10 text-white md:text-black flex items-center justify-center transition-colors shadow-sm focus:outline-none"
									aria-label="Close details"
								>
									<X className="w-4 h-4" />
								</button>

								{/* Image Display */}
								<div className="md:w-1/2 bg-black/[0.02] flex items-center justify-center p-2 md:p-4 border-b md:border-b-0 md:border-r border-black/5 overflow-hidden">
									<img
										src={getImageUrl(selectedImage.storage_path)}
										alt={selectedImage.prompt}
										className="max-w-full max-h-[40vh] md:max-h-full object-contain rounded-2xl shadow-sm"
									/>
								</div>

								{/* Metadata Side Panel */}
								<div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6 overflow-y-auto">
									<div className="space-y-5">
										<div>
											<span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
												{selectedImage.style}
											</span>
											<div className="text-[11px] text-black/40 flex items-center gap-1 font-light mt-2.5">
												<Calendar className="w-3 h-3 text-black/35" />
												Generated on {formatDate(selectedImage.created_at)}
											</div>
											{selectedImage.delete_at && (
												<div className="text-[11px] text-amber-500 flex items-center gap-1 font-light mt-2.5">
													<Clock className="w-3 h-3 text-amber-500/80 shrink-0" />
													<span>
														{getDaysUntilDeletionText(selectedImage.delete_at)}
													</span>
												</div>
											)}
										</div>

										<div className="space-y-2">
											<h3 className="text-xs font-bold text-black/40 uppercase tracking-widest">
												Prompt description
											</h3>
											<p className="text-sm md:text-base text-black/85 leading-relaxed font-light tracking-wide bg-black/[0.01] border border-black/5 p-4 rounded-2xl select-text max-h-36 overflow-y-auto break-words">
												{selectedImage.prompt}
											</p>
										</div>
									</div>

									<button
										onClick={(e) => {
											handleDownload(
												e,
												selectedImage.storage_path,
												selectedImage.prompt,
												selectedImage.id,
											);
										}}
										disabled={downloadingId === selectedImage.id}
										className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r bg-black text-white hover:bg-black/85 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-500/15 active:scale-[0.98] mt-6 shrink-0"
									>
										{downloadingId === selectedImage.id ? (
											<>
												<div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												Downloading...
											</>
										) : (
											<>
												<Download className="w-4 h-4" />
												Download Stencil
											</>
										)}
									</button>
								</div>
							</motion.div>
						</div>
					)}
				</AnimatePresence>

				{/* Auxiliary Login Modal */}
				<LoginModal
					isOpen={isLoginModalOpen}
					onClose={() => setIsLoginModalOpen(false)}
				/>
			</div>
		</Background>
	);
}

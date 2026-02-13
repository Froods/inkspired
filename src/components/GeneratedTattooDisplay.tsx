import { X } from 'lucide-react';

export default function GeneratedTattooDisplay({
	imageStatus,
	loadingStatus,
	errorStatus,
	isOpen,
	onClose,
}: {
	imageStatus: string | null;
	loadingStatus: boolean;
	errorStatus: string | null;
	isOpen: boolean;
	onClose: () => void;
}) {
	return (
		<dialog
			open={isOpen}
			className="bg-white/5 backdrop-blur-xl border border-white/20 fixed inset-0 z-50 m-auto w-full max-w-3xl min-h-[50vh] max-h-[85vh] p-8 rounded-3xl shadow-2xl shadow-black/50 backdrop:bg-black/60 transition-all duration-300"
		>
			<div className="flex flex-row justify-end pr-1 pt-1 absolute top-4 right-4 z-10">
				<button
					type="button"
					onClick={onClose}
					className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
					aria-label="Close"
				>
					<X strokeWidth={2.5} className="h-5 w-5" />
				</button>
			</div>
			<div className="flex flex-col items-center justify-evenly w-full h-full">
				{/* Loading State */}
				{loadingStatus && (
					<div className="mt-8 flex flex-col items-center justify-center text-white/50">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
						<p>Inkspired AI is dreaming up your design...</p>
					</div>
				)}

				{/* Error Message */}
				{errorStatus && (
					<div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center">
						{errorStatus}
					</div>
				)}

				{/* The Generated Tattoo */}
				{imageStatus && (
					<div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-w-md w-full">
						<img
							src={imageStatus}
							alt="Generated Tattoo"
							className="w-full h-auto object-cover"
						/>
						{/* Optional: Download Button Overlay */}
						<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
							<a
								href={imageStatus}
								download="inkspired-tattoo.png"
								className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg rounded-full font-medium transition-all transform hover:scale-105"
							>
								Download Design
							</a>
						</div>
					</div>
				)}
			</div>
		</dialog>
	);
}

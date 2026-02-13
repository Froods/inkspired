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
			className="bg-gray-800 border border-white/10 backdrop:bg-black/80 fixed inset-0 z-50 m-auto w-6/12 max-w-screen-lg h-4/5 p-4 rounded-2xl"
		>
			<div className="flex flex-row justify-end pr-1 pt-1">
				<div
					onClick={onClose}
					className="rounded-full bg-gray-500 p-0.5 hover:bg-gray-400 hover:cursor-pointer"
				>
					<X strokeWidth={2.75} className="h-4 w-4 text-gray-800"></X>
				</div>
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
					<div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-w-md">
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
								className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
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

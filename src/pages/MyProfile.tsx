'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	User as UserIcon,
	Lock,
	Eye,
	EyeOff,
	ShieldAlert,
	CheckCircle2,
	AlertCircle,
	X,
	ArrowRight,
	Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext';
import Sidebar from '@/components/Sidebar';
import LoginModal from '@/components/LoginModal';
import { ElegantShape } from '@/components/ElegantShape';

export default function MyProfile() {
	const { claims, supabase } = useAuth();
	const navigate = useNavigate();

	// User state
	const [user, setUser] = useState<any>(null);
	const [loadingUser, setLoadingUser] = useState(true);

	// Form states
	const [displayName, setDisplayName] = useState('');
	const [isSavingName, setIsSavingName] = useState(false);
	const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	// Password change states
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSavingPassword, setIsSavingPassword] = useState(false);
	const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

	// Deletion states
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [deleteConfirmText, setDeleteConfirmText] = useState('');
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	// Login Modal State for logged-out view
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	// Fetch latest user data from Supabase Auth
	useEffect(() => {
		if (!claims) {
			setLoadingUser(false);
			return;
		}

		async function fetchUser() {
			try {
				setLoadingUser(true);
				const { data: { user }, error } = await supabase.auth.getUser();
				if (error) throw error;
				if (user) {
					setUser(user);
					setDisplayName(user.user_metadata?.display_name || user.user_metadata?.full_name || '');
				}
			} catch (err) {
				console.error('Error fetching user metadata:', err);
			} finally {
				setLoadingUser(false);
			}
		}

		fetchUser();
	}, [claims, supabase]);

	// Handler: Save Display Name
	const handleSaveName = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!displayName.trim()) {
			setNameMessage({ type: 'error', text: 'Display name cannot be empty.' });
			return;
		}

		setIsSavingName(true);
		setNameMessage(null);

		try {
			const { data, error } = await supabase.auth.updateUser({
				data: { display_name: displayName.trim() },
			});

			if (error) throw error;

			setUser(data.user);
			setNameMessage({ type: 'success', text: 'Display name updated successfully!' });
		} catch (err: any) {
			console.error('Failed to update display name:', err);
			setNameMessage({ type: 'error', text: err.message || 'Failed to update display name.' });
		} finally {
			setIsSavingName(false);
		}
	};

	// Handler: Change Password
	const handleSavePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordMessage(null);

		if (newPassword !== confirmPassword) {
			setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
			return;
		}

		if (newPassword.length < 6) {
			setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
			return;
		}

		setIsSavingPassword(true);

		try {
			const { error } = await supabase.auth.updateUser({
				password: newPassword,
			});

			if (error) throw error;

			setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
			setNewPassword('');
			setConfirmPassword('');
		} catch (err: any) {
			console.error('Failed to update password:', err);
			setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password.' });
		} finally {
			setIsSavingPassword(false);
		}
	};

	// Handler: Delete Account
	const handleDeleteAccount = async () => {
		if (deleteConfirmText.toLowerCase() !== 'password') return;

		setIsDeleting(true);
		setDeleteError(null);

		try {
			// Try to call user self-deletion PostgreSQL function via RPC
			const { error } = await supabase.rpc('delete_user_account');

			if (error) throw error;

			// Sign out client-side if delete succeeded
			await supabase.auth.signOut();
			setIsDeleteModalOpen(false);
			navigate('/');
		} catch (err: any) {
			console.error('Account deletion error:', err);
			
			// Custom message for missing RPC function or lacking permission
			if (
				err.message?.includes('does not exist') ||
				err.code === 'P0001' ||
				err.status === 404 ||
				err.message?.includes('method not found')
			) {
				setDeleteError(
					"The custom 'delete_user_account' function is not configured in your Supabase database. " +
					"To enable users to delete their own accounts, execute the following SQL in your Supabase SQL Editor:\n\n" +
					"CREATE OR REPLACE FUNCTION delete_user_account()\n" +
					"RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$\n" +
					"BEGIN\n" +
					"  DELETE FROM auth.users WHERE id = auth.uid();\n" +
					"END;\n" +
					"$$;"
				);
			} else {
				setDeleteError(err.message || 'Failed to delete account. Please try again.');
			}
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="relative min-h-screen w-full flex bg-white font-sans overflow-x-hidden select-none">
			{/* Persistent Navigation Sidebar */}
			<Sidebar onLoginClick={() => setIsLoginModalOpen(true)} />

			{/* Background Ambient Gradients */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-pink-500/[0.04] blur-3xl pointer-events-none" />

			{/* Floating Background Shapes */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<ElegantShape
					delay={0.3}
					width={240}
					height={240}
					rotate={12}
					className="left-[-12%] md:left-[3%] top-[12%] md:top-[4%]"
					illustration={3}
				/>
				<ElegantShape
					delay={0.5}
					width={250}
					height={250}
					rotate={-15}
					className="right-[50%] md:right-[6%] top-[72%] md:top-[68%]"
					illustration={1}
				/>
				<ElegantShape
					delay={0.4}
					width={210}
					height={210}
					rotate={25}
					className="left-[4%] md:left-[36%] bottom-[4%] md:bottom-[-3%]"
					illustration={4}
				/>
				<ElegantShape
					delay={0.6}
					width={380}
					height={380}
					rotate={18}
					className="right-[12%] md:right-[-4%] top-[8%] md:top-[-6%]"
					illustration={2}
				/>
				<ElegantShape
					delay={0.7}
					width={350}
					height={350}
					rotate={-20}
					className="left-[8%] md:left-[2%] bottom-[12%] md:bottom-[-4%]"
					illustration={5}
				/>
			</div>

			{/* Page Content Container */}
			<div className="flex-1 min-h-screen pl-24 md:pl-28 pr-6 md:pr-12 py-12 relative z-10 flex flex-col justify-center">
				<div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center py-6">
					
					{/* Header Section */}
					<div className="flex flex-col mb-8 border-b border-black/5 pb-6">
						<h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black">
							My Profile
						</h1>
						<p className="text-sm md:text-base text-black/50 mt-2 font-light">
							Manage your public identity, account security, and deletion settings.
						</p>
					</div>

					{/* Loading State */}
					{claims && loadingUser ? (
						<div className="bg-white/40 backdrop-blur-xl border border-black/10 p-8 rounded-3xl shadow-xl flex items-center justify-center min-h-[300px]">
							<div className="flex flex-col items-center gap-3">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
								<span className="text-sm text-black/40 font-light">Loading profile details...</span>
							</div>
						</div>
					) : !claims ? (
						/* --- LOGGED OUT / LOCKED STATE --- */
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="bg-white/40 backdrop-blur-xl border border-black/10 p-8 rounded-3xl text-center shadow-xl shadow-black/[0.02] flex flex-col items-center max-w-md mx-auto self-center"
						>
							<div className="w-16 h-16 rounded-3xl bg-black/[0.03] border border-black/5 flex items-center justify-center mb-6">
								<Lock className="w-6 h-6 text-black/60" />
							</div>
							
							<h2 className="text-2xl font-semibold text-black tracking-tight mb-3">
								Access Restricted
							</h2>
							<p className="text-black/60 text-sm leading-relaxed mb-8 font-light">
								Please sign in to view and edit your profile settings, including display name, password updates, and account configurations.
							</p>

							<button
								onClick={() => setIsLoginModalOpen(true)}
								className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-500/90 text-white rounded-full text-sm font-semibold hover:from-blue-600 hover:to-blue-600/90 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
							>
								Log in or sign up
								<ArrowRight className="w-4 h-4" />
							</button>
						</motion.div>
					) : (
						/* --- LOGGED IN VIEW --- */
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ type: 'spring', damping: 25, stiffness: 350 }}
							className="bg-white/40 backdrop-blur-xl border border-black/10 p-8 rounded-3xl shadow-xl shadow-black/[0.02] space-y-10"
						>
							
							{/* Form 1: General Info & Display Name */}
							<form onSubmit={handleSaveName} className="space-y-5">
								<div className="flex items-center gap-2 border-b border-black/5 pb-3">
									<UserIcon className="w-5 h-5 text-black/60" />
									<h2 className="text-lg font-semibold text-black">Profile Details</h2>
								</div>

								{/* Read-only Email Field */}
								<div className="space-y-2">
									<label className="text-xs font-bold text-black/40 uppercase tracking-widest block">
										Email Address
									</label>
									<div className="relative">
										<input
											type="email"
											disabled
											value={user?.email || ''}
											className="w-full px-5 py-3.5 border border-black/5 bg-black/[0.02] rounded-2xl text-black/45 cursor-not-allowed select-text font-light"
										/>
										<div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/25">
											<Mail className="w-4 h-4" />
										</div>
									</div>
								</div>

								{/* Display Name Input */}
								<div className="space-y-2">
									<label className="text-xs font-bold text-black/40 uppercase tracking-widest block">
										Display Name
									</label>
									<input
										type="text"
										placeholder="e.g. John Doe"
										value={displayName}
										onChange={(e) => setDisplayName(e.target.value)}
										className="w-full px-5 py-3.5 border border-black/10 bg-white/50 rounded-2xl text-black focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 transition-all font-light"
									/>
								</div>

								{/* Display Name Messages */}
								<AnimatePresence mode="wait">
									{nameMessage && (
										<motion.div
											initial={{ opacity: 0, y: -5 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -5 }}
											className={`flex items-start gap-2.5 p-3.5 rounded-2xl border text-sm font-light leading-relaxed ${
												nameMessage.type === 'success'
													? 'bg-green-50/50 border-green-200 text-green-800'
													: 'bg-red-50/50 border-red-200 text-red-800'
											}`}
										>
											{nameMessage.type === 'success' ? (
												<CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
											) : (
												<AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
											)}
											<span>{nameMessage.text}</span>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Submit Button */}
								<div className="flex justify-end">
									<button
										type="submit"
										disabled={isSavingName}
										className="px-6 py-3 bg-black hover:bg-black/85 text-white rounded-full text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{isSavingName ? (
											<>
												<div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												Saving...
											</>
										) : (
											'Save Display Name'
										)}
									</button>
								</div>
							</form>

							{/* Form 2: Password Change */}
							<form onSubmit={handleSavePassword} className="space-y-5 pt-4 border-t border-black/5">
								<div className="flex items-center gap-2 border-b border-black/5 pb-3">
									<Lock className="w-5 h-5 text-black/60" />
									<h2 className="text-lg font-semibold text-black">Update Password</h2>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{/* New Password */}
									<div className="space-y-2">
										<label className="text-xs font-bold text-black/40 uppercase tracking-widest block">
											New Password
										</label>
										<div className="relative">
											<input
												type={showNewPassword ? 'text' : 'password'}
												placeholder="••••••••"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												className="w-full px-5 py-3.5 pr-12 border border-black/10 bg-white/50 rounded-2xl text-black focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 transition-all font-light"
											/>
											<button
												type="button"
												onClick={() => setShowNewPassword(!showNewPassword)}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60"
											>
												{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</button>
										</div>
									</div>

									{/* Confirm New Password */}
									<div className="space-y-2">
										<label className="text-xs font-bold text-black/40 uppercase tracking-widest block">
											Confirm Password
										</label>
										<div className="relative">
											<input
												type={showConfirmPassword ? 'text' : 'password'}
												placeholder="••••••••"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												className="w-full px-5 py-3.5 pr-12 border border-black/10 bg-white/50 rounded-2xl text-black focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/30 transition-all font-light"
											/>
											<button
												type="button"
												onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60"
											>
												{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
											</button>
										</div>
									</div>
								</div>

								{/* Password Messages */}
								<AnimatePresence mode="wait">
									{passwordMessage && (
										<motion.div
											initial={{ opacity: 0, y: -5 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -5 }}
											className={`flex items-start gap-2.5 p-3.5 rounded-2xl border text-sm font-light leading-relaxed ${
												passwordMessage.type === 'success'
													? 'bg-green-50/50 border-green-200 text-green-800'
													: 'bg-red-50/50 border-red-200 text-red-800'
											}`}
										>
											{passwordMessage.type === 'success' ? (
												<CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
											) : (
												<AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
											)}
											<span>{passwordMessage.text}</span>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Submit Button */}
								<div className="flex justify-end">
									<button
										type="submit"
										disabled={isSavingPassword || !newPassword || !confirmPassword}
										className="px-6 py-3 bg-black hover:bg-black/85 text-white rounded-full text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
									>
										{isSavingPassword ? (
											<>
												<div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												Updating...
											</>
										) : (
											'Update Password'
										)}
									</button>
								</div>
							</form>

							{/* Danger Zone: Account Deletion */}
							<div className="pt-6 border-t border-black/5 space-y-4">
								<div className="flex items-center gap-2 border-b border-black/5 pb-3">
									<ShieldAlert className="w-5 h-5 text-red-500" />
									<h2 className="text-lg font-semibold text-black">Danger Zone</h2>
								</div>

								<div className="border border-red-200/60 bg-red-50/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
									<div className="space-y-1 max-w-md">
										<h3 className="text-sm font-bold text-red-800">Delete Account</h3>
										<p className="text-xs text-black/50 leading-relaxed font-light">
											Once you delete your account, there is no going back. All of your saved tattoo stencils, history, and metadata will be permanently wiped.
										</p>
									</div>
									<button
										onClick={() => {
											setDeleteError(null);
											setDeleteConfirmText('');
											setIsDeleteModalOpen(true);
										}}
										className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition-all active:scale-[0.98] shrink-0 self-start md:self-auto"
									>
										Delete Account
									</button>
								</div>
							</div>

						</motion.div>
					)}
				</div>
			</div>

			{/* Deletion Confirmation Modal */}
			<AnimatePresence>
				{isDeleteModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
							className="absolute inset-0 bg-black/60 backdrop-blur-md"
						/>

						{/* Modal Box */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 15 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 15 }}
							transition={{ type: 'spring', damping: 25, stiffness: 350 }}
							className="bg-white w-full max-w-md border border-black/10 rounded-3xl shadow-2xl overflow-hidden relative z-10 p-6 md:p-8 flex flex-col gap-5 focus:outline-none"
						>
							{/* Close Button */}
							<button
								disabled={isDeleting}
								onClick={() => setIsDeleteModalOpen(false)}
								className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-black flex items-center justify-center transition-colors disabled:opacity-50"
							>
								<X className="w-4 h-4" />
							</button>

							<div className="flex flex-col items-center text-center mt-3 gap-3">
								<div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
									<ShieldAlert className="w-5 h-5 text-red-600" />
								</div>
								<h3 className="text-xl font-bold text-black tracking-tight">Delete Account Permanently?</h3>
								<p className="text-xs text-black/65 font-light leading-relaxed">
									This action cannot be undone. To proceed, please type the word <strong className="text-red-700 font-semibold">password</strong> in the confirmation box below.
								</p>
							</div>

							<div className="space-y-4">
								<input
									type="text"
									placeholder="type 'password' to confirm"
									value={deleteConfirmText}
									onChange={(e) => setDeleteConfirmText(e.target.value)}
									disabled={isDeleting}
									className="w-full px-4 py-3 border border-black/10 bg-white rounded-xl text-center text-black focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-light"
								/>

								{deleteError && (
									<div className="p-3.5 bg-red-50/70 border border-red-100 rounded-xl text-xs text-red-700 leading-relaxed max-h-[180px] overflow-y-auto font-light whitespace-pre-wrap">
										{deleteError}
									</div>
								)}

								<div className="flex items-center gap-3">
									<button
										type="button"
										onClick={() => setIsDeleteModalOpen(false)}
										disabled={isDeleting}
										className="flex-1 py-3 px-4 bg-black/5 hover:bg-black/10 rounded-full text-xs font-semibold text-black transition-colors text-center disabled:opacity-50"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleDeleteAccount}
										disabled={isDeleting || deleteConfirmText.toLowerCase() !== 'password'}
										className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-semibold transition-colors text-center disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
									>
										{isDeleting ? (
											<>
												<div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
												Deleting...
											</>
										) : (
											'Delete Account'
										)}
									</button>
								</div>
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
	);
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import PromptPage from './PromptPage.tsx';
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import Gallery from './pages/Gallery.tsx';
import MyProfile from './pages/MyProfile.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import { AuthProvider } from './AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<PromptPage />}></Route>
					<Route path="/login" element={<Login />}></Route>
					<Route path="/signup" element={<SignUp />}></Route>
					<Route path="/gallery" element={<Gallery />}></Route>
					<Route path="/profile" element={<MyProfile />}></Route>
					<Route path="/forgot-password" element={<ForgotPassword />}></Route>
					<Route path="/reset-password" element={<ResetPassword />}></Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);

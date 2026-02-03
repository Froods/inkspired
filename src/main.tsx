import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PromptPage from './PromptPage.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PromptPage></PromptPage>
	</StrictMode>,
);

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { CaseProvider } from './context/CaseContext.jsx';
import './index.css';
createRoot(document.getElementById('root')).render(<React.StrictMode><CaseProvider><App /></CaseProvider></React.StrictMode>);

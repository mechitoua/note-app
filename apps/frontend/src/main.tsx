import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@components/ThemeProvider';
import { FeedbackProvider } from './contexts/FeedbackContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <FeedbackProvider>
        <App />
      </FeedbackProvider>
    </ThemeProvider>
  </React.StrictMode>
);

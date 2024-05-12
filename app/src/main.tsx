import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import './index.css';
import { Toaster } from 'sonner';
import { CustomerCashProvider } from './context/CustomerCash.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CustomerCashProvider>
        <App />
        <Toaster />
      </CustomerCashProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

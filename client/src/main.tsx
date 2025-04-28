import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthContextProvider } from './providers/AuthContextProvider.tsx';
import { Toaster } from 'react-hot-toast';
import { SocketContextProvider } from './providers/SocketContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
      <Toaster />
    </AuthContextProvider>
  </StrictMode>,
);

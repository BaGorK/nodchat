import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';
import { AuthContextProvider } from './providers/AuthContextProvider.tsx';
import { SocketContextProvider } from './providers/SocketContextProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <>
    <AuthContextProvider>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
      <Toaster />
    </AuthContextProvider>
  </>,
);

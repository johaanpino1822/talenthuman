import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext'; // Importa el ThemeProvider
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider> {/* Envuelve tu App con el ThemeProvider */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { inject } from '@vercel/analytics';

// Initialize Vercel Web Analytics
inject();

// --- CONFIGURAÇÃO AWS AMPLIFY ---
// 1. O arquivo aws-exports é gerado automaticamente pelo comando 'amplify push'
// 2. Descomente as linhas abaixo após instalar o pacote: npm install aws-amplify

// import { Amplify } from 'aws-amplify';
// import awsExports from './aws-exports'; // O arquivo estará na mesma pasta do index.tsx
// Amplify.configure(awsExports);

// --------------------------------

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
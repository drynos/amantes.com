import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Amplify } from 'aws-amplify';

// Tenta importar a configuração do AWS. 
// Se o usuário não tiver rodado 'amplify push', isso pode falhar no build local,
// mas em produção deve existir.
import awsExports from './aws-exports';

// Configura o Amplify
Amplify.configure(awsExports);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Critical Application Error:", error);
  rootElement.innerHTML = `
    <div style="color: #ef4444; padding: 20px; font-family: sans-serif; background: #18181b; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h1 style="font-size: 24px; margin-bottom: 10px;">Ocorreu um erro ao iniciar o app</h1>
      <p style="color: #a1a1aa;">Verifique se você rodou 'amplify push' para gerar o arquivo aws-exports.js.</p>
      <pre style="background: #000; padding: 10px; border-radius: 8px; margin-top: 20px; color: #f87171;">${error instanceof Error ? error.message : 'Erro desconhecido'}</pre>
    </div>
  `;
}
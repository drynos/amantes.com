/**
 * SERVICE: Storage Service
 * 
 * Este arquivo gerencia o upload de arquivos.
 * Para usar AWS S3 real:
 * 1. Configure no index.tsx (Amplify.configure)
 * 2. Descomente as importações e o código AWS abaixo.
 */

// --- IMPORTAÇÕES AWS (Descomente após instalar aws-amplify) ---
// import { uploadData, getUrl } from 'aws-amplify/storage';

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Faz o upload de um arquivo (Vídeo ou Imagem)
 * @param file O arquivo selecionado pelo usuário
 * @param onProgress Callback para atualizar a barra de progresso (0-100)
 */
export const uploadFileToStorage = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<UploadResult> => {
  
  // --- IMPLEMENTAÇÃO REAL AWS S3 (Descomente para usar) ---
  /*
  try {
    const filename = `${Date.now()}-${file.name}`;
    
    const operation = uploadData({
      key: `uploads/${filename}`,
      data: file,
      options: {
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            const percent = Math.round((transferredBytes / totalBytes) * 100);
            onProgress(percent);
          }
        }
      }
    });

    const result = await operation.result;
    
    // Obter URL assinada (se necessário para buckets privados)
    // const urlOutput = await getUrl({ key: result.key });
    
    return {
      key: result.key,
      url: "" // urlOutput.url.toString() se usar getUrl
    };
  } catch (error) {
    console.error("Erro no upload AWS:", error);
    throw error;
  }
  */

  // --- IMPLEMENTAÇÃO MOCK (Simulação atual) ---
  console.log("Simulando upload para AWS S3...");
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15; // Incremento um pouco mais rápido
      if (progress > 100) progress = 100;
      
      onProgress(Math.floor(progress));

      if (progress === 100) {
        clearInterval(interval);
        resolve({
          key: `mock-key-${Date.now()}`,
          url: URL.createObjectURL(file) // URL local temporária para preview
        });
      }
    }, 300);
  });
};
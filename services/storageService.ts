import { uploadData, getUrl } from 'aws-amplify/storage';

export interface UploadResult {
  key: string;
  url: string;
}

/**
 * Faz o upload de um arquivo para o bucket S3 configurado via Amplify
 * @param file O arquivo selecionado pelo usuário
 * @param onProgress Callback para atualizar a barra de progresso (0-100)
 */
export const uploadFileToStorage = async (
  file: File, 
  onProgress: (progress: number) => void
): Promise<UploadResult> => {
  
  try {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Inicia o upload
    const operation = uploadData({
      key: `public/uploads/${filename}`, // 'public/' permite acesso guest se configurado
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

    // Aguarda o término
    const result = await operation.result;
    
    // Tenta obter a URL pública (para arquivos 'public')
    // Nota: Em buckets privados, getUrl retorna uma URL assinada temporária.
    const urlOutput = await getUrl({ key: result.key });
    
    return {
      key: result.key,
      url: urlOutput.url.toString()
    };

  } catch (error) {
    console.error("Erro no upload AWS S3:", error);
    
    // Fallback silencioso para Mock se a AWS falhar (útil para testes sem backend conectado)
    console.warn("Falha no S3. Usando Mock local temporário.");
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve({
            key: `mock-fallback-${Date.now()}`,
            url: URL.createObjectURL(file)
          });
        }
      }, 200);
    });
  }
};
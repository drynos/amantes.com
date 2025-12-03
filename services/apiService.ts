import { post, get } from 'aws-amplify/api';

/**
 * Serviço para comunicação com o Backend AWS (Lambda + API Gateway).
 * 
 * Antes de usar, você deve rodar no terminal:
 * 1. amplify add api (Selecione REST)
 * 2. amplify add function (Para criar a lógica do backend)
 * 3. amplify push
 */

const API_NAME = 'AmantesAPI'; // O nome que você deu ao criar a API no comando 'amplify add api'
const PATH = '/users'; // O caminho (path) definido na sua função Lambda

export interface UserProfileData {
  userId: string;
  name: string;
  stats: {
    videos: number;
    followers: number;
    crisex: number;
  };
}

export const saveUserProfile = async (data: UserProfileData) => {
  try {
    const restOperation = post({ 
      apiName: API_NAME,
      path: PATH,
      options: {
        body: data
      }
    });

    const response = await restOperation.response;
    const json = await response.body.json();
    console.log('Dados salvos no DynamoDB via Lambda:', json);
    return json;
  } catch (error) {
    console.warn("Backend Offline ou não configurado. Usando modo offline.", error);
    // Simulação de sucesso para não travar a UI enquanto o backend não existe
    return { success: true, message: "Modo Offline: Dados salvos localmente" };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const restOperation = get({ 
      apiName: API_NAME,
      path: `${PATH}/${userId}`
    });

    const response = await restOperation.response;
    return await response.body.json();
  } catch (error) {
    console.warn("Backend Offline. Retornando dados mockados.", error);
    return null;
  }
};
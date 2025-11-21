import axios from 'axios';
import type {
  MM1Input, MM1Result,
  MMsInput, MMsResult,
  MM1KInput, MM1KResult,
  MMsKInput, MMsKResult,
  MM1NInput, MM1NResult,
  MMsNInput, MMsNResult,
  MG1Input, MG1Result,
  PrioritySemInput, PrioritySemResult,
  PriorityComInput, PriorityComResult,
} from '../types/models';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// FUNÇÕES DE CHAMADA PARA CADA MODELO
// ==========================================

// M/M/1
export const calculateMM1 = async (input: MM1Input): Promise<MM1Result> => {
  const response = await api.post<MM1Result>('/calculate/mm1', input);
  return response.data;
};

// M/M/s>1
export const calculateMMs = async (input: MMsInput): Promise<MMsResult> => {
  const response = await api.post<MMsResult>('/calculate/mms', input);
  return response.data;
};

// M/M/1/K
export const calculateMM1K = async (input: MM1KInput): Promise<MM1KResult> => {
  const response = await api.post<MM1KResult>('/calculate/mm1k', input);
  return response.data;
};

// M/M/s>1/K
export const calculateMMsK = async (input: MMsKInput): Promise<MMsKResult> => {
  const response = await api.post<MMsKResult>('/calculate/mmsk', input);
  return response.data;
};

// M/M/1/N
export const calculateMM1N = async (input: MM1NInput): Promise<MM1NResult> => {
  const response = await api.post<MM1NResult>('/calculate/mm1n', input);
  return response.data;
};

// M/M/s>1/N
export const calculateMMsN = async (input: MMsNInput): Promise<MMsNResult> => {
  const response = await api.post<MMsNResult>('/calculate/mmsn', input);
  return response.data;
};

// M/G/1
export const calculateMG1 = async (input: MG1Input): Promise<MG1Result> => {
  const response = await api.post<MG1Result>('/calculate/mg1', input);
  return response.data;
};

// Priority Models
export const calculatePrioritySem = async (input: PrioritySemInput): Promise<PrioritySemResult> => {
  const response = await api.post<PrioritySemResult>('/calculate/priority-sem', input);
  return response.data;
};

export const calculatePriorityCom = async (input: PriorityComInput): Promise<PriorityComResult> => {
  const response = await api.post<PriorityComResult>('/calculate/priority-com', input);
  return response.data;
};

// ==========================================
// TRATAMENTO DE ERROS
// ==========================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro da API (4xx, 5xx)
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Erro ao processar a requisição');
    } else if (error.request) {
      // Sem resposta do servidor
      console.error('Network Error:', error.request);
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } else {
      // Erro na configuração da requisição
      console.error('Request Error:', error.message);
      throw new Error('Erro ao configurar a requisição');
    }
  }
);

export default api;

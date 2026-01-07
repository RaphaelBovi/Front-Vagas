import axios from 'axios';

// Configuração da URL da API
// Desenvolvimento
const API_URL_DEV = 'http://localhost:8080/api';

// Produção
const API_URL_PROD = 'https://api-vagasraphael.com/api';

// Usa variável de ambiente se disponível, senão usa produção como padrão
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'development' ? API_URL_DEV : API_URL_PROD);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para enviar cookies se necessário
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      throw new Error(error.response.data.message || 'Erro ao processar requisição');
    } else if (error.request) {
      // Erro de rede
      throw new Error('Erro de conexão. Verifique se a API está rodando.');
    } else {
      // Outro erro
      throw new Error('Erro inesperado');
    }
  }
);

export const curriculoService = {
  // Criar currículo
  criar: async (curriculo) => {
    const response = await api.post('/curriculos', curriculo);
    return response.data;
  },

  // Buscar currículo por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/curriculos/${id}`);
    return response.data;
  },

  // Atualizar currículo
  atualizar: async (id, curriculo) => {
    const response = await api.put(`/curriculos/${id}`, curriculo);
    return response.data;
  },

  // Deletar currículo
  deletar: async (id) => {
    await api.delete(`/curriculos/${id}`);
  },

  // Buscar vagas para um currículo
  buscarVagas: async (id) => {
    const response = await api.get(`/curriculos/${id}/vagas`);
    return response.data;
  },
};

export default api;


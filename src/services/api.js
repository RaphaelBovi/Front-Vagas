import axios from 'axios';

// Configuração da URL da API
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error('VITE_API_URL não está configurada! Configure a variável de ambiente.');
  throw new Error('VITE_API_URL não está configurada. Configure a variável de ambiente no Railway ou no arquivo .env');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 30000, // 30 segundos
});

// Função para retry com backoff
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || 'Erro ao processar requisição';
      
      if (status === 404) {
        throw new Error('Recurso não encontrado');
      } else if (status === 401) {
        throw new Error('Não autorizado');
      } else if (status === 403) {
        throw new Error('Acesso negado');
      } else if (status >= 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde.');
      } else {
        throw new Error(message);
      }
    } else if (error.request) {
      throw new Error('Erro de conexão. Verifique se a API está rodando.');
    } else {
      throw new Error('Erro inesperado');
    }
  }
);

export const curriculoService = {
  // Criar currículo
  criar: async (curriculo) => {
    const response = await retryRequest(() => api.post('/curriculos', curriculo));
    return response.data;
  },

  // Buscar currículo por ID
  buscarPorId: async (id) => {
    const response = await retryRequest(() => api.get(`/curriculos/${id}`));
    return response.data;
  },

  // Atualizar currículo
  atualizar: async (id, curriculo) => {
    const response = await retryRequest(() => api.put(`/curriculos/${id}`, curriculo));
    return response.data;
  },

  // Deletar currículo
  deletar: async (id) => {
    await retryRequest(() => api.delete(`/curriculos/${id}`));
  },

  // Buscar vagas para um currículo
  buscarVagas: async (id) => {
    const response = await retryRequest(() => api.get(`/curriculos/${id}/vagas`));
    return response.data;
  },
};

export const vagaService = {
  // Listar todas as vagas
  listar: async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        params.append(key, filtros[key]);
      }
    });
    const response = await retryRequest(() => api.get(`/vagas?${params.toString()}`));
    return response.data;
  },

  // Buscar vaga por ID
  buscarPorId: async (id) => {
    const response = await retryRequest(() => api.get(`/vagas/${id}`));
    return response.data;
  },

  // Buscar vagas por palavra-chave
  buscar: async (palavraChave) => {
    const response = await retryRequest(() => api.get(`/vagas/buscar?q=${encodeURIComponent(palavraChave)}`));
    return response.data;
  },

  // Buscar vagas por região (cidade + estado)
  buscarPorRegiao: async (cidade, estado) => {
    const params = new URLSearchParams();
    if (cidade) params.append('cidade', cidade);
    if (estado) params.append('estado', estado);
    const response = await retryRequest(() => api.get(`/vagas/regiao?${params.toString()}`));
    return response.data;
  },

  // Buscar vagas em destaque
  buscarDestaque: async () => {
    const response = await retryRequest(() => api.get('/vagas/destaque'));
    return response.data;
  },

  // Buscar vagas recentes
  buscarRecentes: async (limite = 10) => {
    const response = await retryRequest(() => api.get(`/vagas/recentes?limite=${limite}`));
    return response.data;
  },

  // Candidatar-se a uma vaga
  candidatar: async (vagaId, curriculoId) => {
    const response = await retryRequest(() => api.post(`/vagas/${vagaId}/candidatar`, { curriculoId }));
    return response.data;
  },

  // Buscar vagas compatíveis com currículo
  buscarVagasCompativel: async (curriculoId) => {
    const response = await retryRequest(() => api.get(`/curriculos/${curriculoId}/vagas`));
    return response.data;
  },
};

export const empresaService = {
  // Listar empresas
  listar: async () => {
    const response = await retryRequest(() => api.get('/empresas'));
    return response.data;
  },

  // Buscar empresa por ID
  buscarPorId: async (id) => {
    const response = await retryRequest(() => api.get(`/empresas/${id}`));
    return response.data;
  },
};

export default api;

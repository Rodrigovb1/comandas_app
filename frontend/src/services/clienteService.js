import { API_ENDPOINTS } from '../config/apiConfig';
import api from './api';

const { CLIENTE } = API_ENDPOINTS;

export const clienteService = {
    list: async (params = {}) => {
        const { skip = 0, limit = 100, id, nome, cpf, telefone } = params;
        const queryParams = new URLSearchParams();

        queryParams.append('skip', skip);
        queryParams.append('limit', limit);
        if (id !== undefined && id !== null && id !== '') queryParams.append('id', id);
        if (nome !== undefined && nome !== null && nome !== '') queryParams.append('nome', nome);
        if (cpf !== undefined && cpf !== null && cpf !== '') queryParams.append('cpf', cpf);
        if (telefone !== undefined && telefone !== null && telefone !== '') queryParams.append('telefone', telefone);

        const response = await api.get(`${CLIENTE.LIST}?${queryParams.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(CLIENTE.GET.replace(':id', id));
        return response.data;
    },

    create: async (clienteData) => {
        const response = await api.post(CLIENTE.CREATE, clienteData);
        return response.data;
    },

    update: async (id, clienteData) => {
        const response = await api.put(CLIENTE.UPDATE.replace(':id', id), clienteData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(CLIENTE.DELETE.replace(':id', id));
        return { success: true };
    },

    checkCpfExists: async (cpf, excludeId = null) => {
        const params = { cpf };
        if (excludeId) {
            params.exclude_id = excludeId;
        }

        const response = await api.get(`${CLIENTE.LIST}?${new URLSearchParams(params).toString()}`);
        const clientes = response.data?.items || response.data || [];

        return clientes.length > 0 ? clientes[0] : null;
    },
};

export default clienteService;

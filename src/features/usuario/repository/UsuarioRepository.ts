import { UsuarioModel } from "../models/UsuarioModel";
import { api } from "@/services/api";

export class Repository {

  async getUsuarioAutenticado() {
    try {
      const response = await api.get('/auth/usuario');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.mensagem || error.message);
    }
  }


  async criarUsuario(nome: string, usuario: string, email: string, senha: string): Promise<UsuarioModel> {
    try {
      const response = await api.post<UsuarioModel>('/usuarios/criar', { "nome_completo": nome, usuario, email, senha });

      return response.data;

    } catch (error: any) {
      console.error("Erro detalhado ao criar usuário:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Extrai mensagem específica do backend
      let message = 
        error.response?.data?.mensagem || 
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.response?.data?.detail;
      
      if (!message) {
        const status = error.response?.status;
        if (status === 409) {
          message = "Este usuário ou e-mail já está em uso";
        } else if (status === 400) {
          message = "Dados inválidos. Verifique os campos.";
        } else if (status === 500) {
          message = "Erro no servidor. Tente novamente.";
        } else {
          message = error.message || "Erro ao criar usuário";
        }
      }
      
      throw new Error(message);
    }

  }

  async atualizarUsuario(id_usuario: number, dados: Partial<{
    nome_completo: string;
    usuario: string;
    email: string;
    senha: string;
  }>) {
    const response = await api.put(`/usuarios/atualizar/${id_usuario}`, dados);
    return response.data;
  }
}


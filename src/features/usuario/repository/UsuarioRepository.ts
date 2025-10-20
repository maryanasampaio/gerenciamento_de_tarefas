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
      throw new Error(error.message || "Erro ao criar usuário");
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


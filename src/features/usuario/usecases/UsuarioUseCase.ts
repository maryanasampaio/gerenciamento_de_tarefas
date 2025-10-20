import { UsuarioModel } from "../models/UsuarioModel";
import { Repository } from "../repository/UsuarioRepository";

export class UsuarioUseCase {
  protected repository;

  constructor() {
    this.repository = new Repository();
  }


  async criar(nome: string, usuario: string, email: string, senha: string): Promise<UsuarioModel> {
    try {
      if (!nome || !usuario || !email || !senha) {
        throw new Error("Todos os campos são obrigatórios");
      }
      const response = await this.repository.criarUsuario(nome, usuario, email, senha);

      if (response.status >= 400) {
        throw new Error(response.mensagem);
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar usuário");
    }
  }
  async buscarUsuarioAutenticado() {
    try {
      const response = await this.repository.getUsuarioAutenticado();

      if (response.status !== 200) {
        throw new Error(response.mensagem);
      }

      return response.dados;
    } catch (error: any) {
      throw new Error(error.response?.data?.mensagem || "Erro ao buscar usuário autenticado");
    }
  }

  async atualizarUsuario(
    id_usuario: number,
    dados: Partial<{ nome_completo: string; usuario: string; email: string; senha: string }>
  ) {
    try {
      const response = await this.repository.atualizarUsuario(id_usuario, dados);

      if (response.status !== 200) {
        throw new Error(response.mensagem);
      }

      return response.dados;
    } catch (error: any) {
      throw new Error(error.response?.data?.mensagem || "Erro ao atualizar usuário");
    }
  }
}

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

}


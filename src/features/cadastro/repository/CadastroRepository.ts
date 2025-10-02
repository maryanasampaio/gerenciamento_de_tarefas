import { UsuarioModel } from "../models/UsuarioModel";
import { api } from "@/services/api";

export class Repository {

  async criarUsuario(nome: string, usuario: string, email: string, senha: string): Promise<UsuarioModel> {
    try {
      const response = await api.post<UsuarioModel>('/usuarios/criar', { "nome_completo": nome, usuario, email, senha });

      return response.data;

    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar usuário");
    }

  }


  // async listarUsuarios(): Promise<UsuarioModel[]> {
  //   return Repository.usuarios;
  // }
}

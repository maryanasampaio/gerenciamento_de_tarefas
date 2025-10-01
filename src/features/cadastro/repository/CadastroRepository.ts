import { UsuarioModel } from "../models/UsuarioModel";

export class Repository {
  private static usuarios: UsuarioModel[] = []; // <- array estático, não reseta

  async criarUsuario(nome: string, usuario: string, email: string, senha: string): Promise<UsuarioModel> {
    const novoUsuario: UsuarioModel = {
      nome,
      usuario,
      email,
      senha,
    };
    Repository.usuarios.push(novoUsuario);
    return novoUsuario;
  }

  async listarUsuarios(): Promise<UsuarioModel[]> {
    return Repository.usuarios;
  }
}

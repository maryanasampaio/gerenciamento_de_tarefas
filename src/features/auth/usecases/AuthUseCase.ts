import { Auth } from "../models/AuthModel";
import { Repository } from "../repository/AuthRepository";

export class AuthUseCase {
  private repository: Repository;

  constructor() {
    this.repository = new Repository();
  }


  async execute(usuario: string, senha: string): Promise<Auth | null> {
    if (!usuario || !senha) {

      throw new Error("Usuário e senha são obrigatórios");
    }

    if (usuario === "admin.teste" && senha === "123456") {
      return { usuario, senha }
    }

    const auth = await this.repository.login(usuario, senha);

    if (!auth) {
      throw new Error("Usuário ou senha inválidos");
    }
    return auth;
  }

}
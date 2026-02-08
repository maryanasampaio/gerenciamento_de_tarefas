import { Repository } from "../repository/AuthRepository";
import { AuthResponse } from "../models/AuthModel";

export class AuthUseCase {
  private repository: Repository;

  constructor() {
    this.repository = new Repository();
  }

  async execute(usuario: string, senha: string): Promise<AuthResponse> {
    if (!usuario || !senha) {
      throw new Error("Usuário e senha são obrigatórios");
    }

    const response = await this.repository.login(usuario, senha);
    return response;
  }

  async logout(): Promise<void> {
    await this.repository.logout();
  }
}

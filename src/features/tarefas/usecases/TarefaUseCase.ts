import { TarefaModel } from "../models/TarefaModel";
import { TarefaRepository } from "../repository/TarefaRepository";

export class TarefaUseCase {
  private repository: TarefaRepository;

  constructor() {
    this.repository = new TarefaRepository();
  }

  async criar(
    titulo: string,
    importancia: string,
    status: string,
    ativo: boolean,
    dataCriacao: string
  ): Promise<TarefaModel> {
    if (!titulo || !importancia || !status || !dataCriacao) {
      throw new Error("Todos os campos são obrigatórios");
    }

    const response: TarefaModel = await this.repository.criarTarefa(
      titulo,
      importancia,
      status,
      ativo,
      dataCriacao
    );

    try {
      if (response.status >= 400) {
        throw new Error(response.mensagem);
      }

      if (!response.dados) {
        throw new Error("Tarefa não encontrada");
      }

      return response;
    } catch (error: any) {
      throw new Error(error.response.mensagem || "Erro ao criar tarefa");
    }

  }

  async listar(): Promise<TarefaModel["dados"]> {
    try {
      const response: TarefaModel = await this.repository.listarTarefas();

      if (response.status >= 400) {
        throw new Error(response.mensagem);
      }

      return response.dados;
    } catch (error: any) {
      throw new Error(error.response.mensagem || "Erro ao listar tarefas");
    }

  }

  async atualizar(
    id_tarefa: number,
    dados: Partial<{
      titulo: string;
      importancia: string;
      status: string;
      ativo: boolean;
    }>
  ): Promise<TarefaModel> {
    try {
      const response = await this.repository.atualizar(id_tarefa, dados);

      if (response.status >= 400) {
        throw new Error(response.mensagem);
      }

      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.mensagem || error.message);
    }
  }



}

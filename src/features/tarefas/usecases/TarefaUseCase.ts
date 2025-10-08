import { data } from "react-router-dom";
import { TarefaModel } from "../models/TarefaModel";
import { TarefaRepository } from "../repository/TarefaRepository";
import { Repository } from "@/features/auth/repository/AuthRepository";

export class TarefaUseCase {
  protected repository;


  constructor() {
    this.repository = new TarefaRepository;

  }


  async criar(titulo: string, importancia: string, status: string, dataCriacao: string): Promise<TarefaModel> {
    try {
      if (!titulo || !importancia || !status || dataCriacao) {
        throw new Error("Todos os campos são obrigatórios");
      }

      const response = await this.repository.criarTarefa(titulo, importancia, status, dataCriacao);
      return response;

    } catch (error: any) {
      throw new Error(error.message || "Erro ao criar tarefa");

    }



  }

  async listar(): Promise<TarefaModel[]> {
    const tarefas = await this.repository.listarTarefas();
    return tarefas;
  }

}
import { TarefaModel } from "../models/TarefaModel";

export class TarefaRepository {
  private static tarefas: TarefaModel[] = [

    {
      titulo: "aaaaaaaaaaaa",
      importancia: "baixa",
      status: "ativo",
      dataCriacao: "11/05/2004"
    },
    {
      titulo: "bbbbbbb",
      importancia: "alta",
      status: "inativa",
      dataCriacao: "11/05/2004"
    }
  ];


  async criarTarefa(titulo: string, importancia: string, status: string, dataCriacao: string): Promise<TarefaModel> {
    const novaTarefa = await { titulo, importancia, status, dataCriacao }

    TarefaRepository.tarefas.push(novaTarefa)

    return novaTarefa;
  }


  async listarTarefas(): Promise<TarefaModel[]> {
    const response = await TarefaRepository.tarefas;
    return response;




  }



}
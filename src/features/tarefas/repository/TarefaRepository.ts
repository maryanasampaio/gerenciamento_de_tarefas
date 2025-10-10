import { api } from "@/services/api";
import { TarefaModel } from "../models/TarefaModel";

export class TarefaRepository {



  async criarTarefa(titulo: string, importancia: string, status: string, ativo: boolean, dataCriacao: string): Promise<TarefaModel> {
    const response = await api.post('/tarefas/criar', { titulo, importancia, status, ativo, dataCriacao });


    return response.data;
    //vai retortar todo a resposta que vier todo backend, com status, mensagem e dados

  }

  async listarTarefas(): Promise<TarefaModel> {
    const response = await api.get('tarefas/listar');
    return response.data; //vai vir toda a resposta de listagem de tarefas

  }

  async atualizar(id_tarefa: number, dados: Partial<{
    titulo: string;
    importancia: string;
    status: string;
    ativo: boolean;
  }>
  ) {
    const response = await api.put(`/tarefas/atualizar/${id_tarefa}`, dados);
    return response.data;

  }

}
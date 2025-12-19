export interface TarefaModel {
  status: number;
  mensagem: string;
  dados: {
    id_tarefa?: number;
    titulo: string;
    importancia: string;
    status: string;
    ativo: boolean | number;
    created_at: string;
  }[];
}

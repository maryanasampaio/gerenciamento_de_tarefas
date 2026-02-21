export type ContextoMeta =
  | 'estudos'
  | 'exercicios'
  | 'trabalho'
  | 'financas'
  | 'saude'
  | 'lazer'
  | 'outros'
  // Categorias expandidas
  | 'treino'
  | 'alimentacao'
  | 'compras'
  | 'projetos_pessoais'
  | 'casa'
  | 'familia'
  | 'relacionamento'
  | 'saude_mental'
  | 'pets'
  | 'transporte'
  | 'ligacoes'
  | 'compromissos'
  | 'metas_pessoais'
  | 'leitura'
  | 'espiritualidade'
  | 'viagens'
  | 'documentacao'
  | 'manutencao';

export interface MetaModel {
  id_meta: number;
  titulo: string;
  descricao: string;
  tipo: 'diaria' | 'mensal' | 'anual';
  contexto: ContextoMeta;
  data_inicio: string;
  data_fim: string;
  status: 'pendente' | 'andamento' | 'concluida';
  importancia: 'baixa' | 'media' | 'alta';
  progresso: number; // 0-100
  tarefas: TarefaMetaModel[];
  created_at: string;
}

export interface TarefaMetaModel {
  id_tarefa_meta: number;
  id_meta: number;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'andamento' | 'concluida';
  importancia?: 'baixa' | 'media' | 'alta';
  data_conclusao?: string;
  created_at: string;
}

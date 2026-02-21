import { MetaModel, TarefaMetaModel } from "./MetaModel";

export type StatusAPI = "pendente" | "em_andamento" | "concluida";
export type PrioridadeAPI = "baixa" | "media" | "alta";

export interface ProgressoAPI {
  total: number;
  concluidas: number;
  percentual: number; // 0-100
}

export interface TarefaMetaAPI {
  id_tarefa: number;
  id_meta: number;
  titulo: string;
  descricao?: string;
  status: "pendente" | "concluida"; // conforme doc
  created_at: string;
}

export interface MetaAPI {
  id_meta: number;
  titulo: string;
  descricao?: string;
  tipo: "diaria" | "mensal" | "anual";
  contexto: string;
  data_inicio: string; // YYYY-MM-DD ou DD/MM/YYYY
  data_fim: string; // YYYY-MM-DD ou DD/MM/YYYY
  status: StatusAPI;
  prioridade: PrioridadeAPI;
  progresso: ProgressoAPI;
  tarefas: TarefaMetaAPI[];
  created_at: string;
}

// Mapeamento API -> Front
function normalizeDatePtBR(dateStr?: string): string {
  if (!dateStr) return "";
  // Se já estiver em DD/MM/AAAA, mantém
  if (dateStr.includes("/")) return dateStr;
  
  // Converte formato ISO (YYYY-MM-DD) manualmente sem timezone
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, ano, mes, dia] = isoMatch;
    return `${dia}/${mes}/${ano}`;
  }
  
  // Fallback: tenta converter como Date
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleDateString("pt-BR");
  }
  return dateStr;
}

export function mapMetaAPIToModel(api: MetaAPI): MetaModel {
  return {
    id_meta: api.id_meta,
    titulo: api.titulo,
    descricao: api.descricao || "",
    tipo: api.tipo,
    contexto: (api.contexto as any),
    data_inicio: normalizeDatePtBR(api.data_inicio),
    data_fim: normalizeDatePtBR(api.data_fim),
    status: api.status === "em_andamento" ? "andamento" : api.status,
    importancia: api.prioridade,
    progresso: api.progresso?.percentual ?? 0,
    tarefas: (api.tarefas || []).map(mapTarefaAPIToModel),
    created_at: api.created_at,
  };
}

export function mapTarefaAPIToModel(t: TarefaMetaAPI): TarefaMetaModel {
  return {
    id_tarefa_meta: t.id_tarefa,
    id_meta: t.id_meta,
    titulo: t.titulo,
    descricao: t.descricao || "",
    status: t.status === "pendente" ? "pendente" : "concluida",
    created_at: t.created_at,
  };
}

import { api } from "@/services/api";
import { MetaAPI, mapMetaAPIToModel } from "../models/MetaAPI";
import { MetaModel, TarefaMetaModel } from "../models/MetaModel";

export interface ResumoMetas {
  pendentes: number;
  em_andamento: number;
  concluidas: number;
  total: number;
}

export interface ListagemMetasResponse {
  metas: MetaModel[];
  resumo: ResumoMetas;
}

export class MetaRepository {
  private toISO(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    if (dateStr.includes('/')) {
      const [dd, mm, yyyy] = dateStr.split('/');
      if (dd && mm && yyyy) return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
    }
    return dateStr;
  }

  async listar(
    tipo: "diaria" | "mensal" | "anual", 
    params?: { 
      data?: string;
      status?: 'pendente' | 'em_andamento' | 'concluida';
      prioridade?: 'alta' | 'media' | 'baixa';
      pesquisa?: string;
    }
  ): Promise<ListagemMetasResponse> {
    const query: string[] = [];
    if (tipo) query.push(`tipo=${encodeURIComponent(tipo)}`);
    if (params?.data) {
      const value = tipo === 'diaria' ? this.toISO(params.data) : params.data;
      query.push(`data=${encodeURIComponent(value || '')}`);
    }
    if (params?.status) {
      query.push(`status=${encodeURIComponent(params.status)}`);
    }
    if (params?.prioridade) {
      query.push(`prioridade=${encodeURIComponent(params.prioridade)}`);
    }
    if (params?.pesquisa) {
      query.push(`pesquisa=${encodeURIComponent(params.pesquisa)}`);
    }
    const url = `/metas/listar${query.length ? `?${query.join("&")}` : ""}`;
    const response = await api.get(url);
    const payload = response.data;
    
    // Novo formato do backend: { data: { metas: [...], resumo: {...} } }
    const dados = payload?.data || payload?.dados || payload;
    
    if (dados.metas && dados.resumo) {
      // Backend retornou formato completo com resumo
      const metas = (dados.metas as MetaAPI[]).map(mapMetaAPIToModel);
      return {
        metas,
        resumo: dados.resumo
      };
    }
    
    // Fallback para formato antigo (apenas array de metas)
    const lista: MetaAPI[] = Array.isArray(dados) ? dados : [];
    const metas = lista.map(mapMetaAPIToModel);
    
    // Calcula resumo localmente se backend não enviar
    const resumo: ResumoMetas = {
      pendentes: metas.filter(m => m.status === 'pendente').length,
      em_andamento: metas.filter(m => m.status === 'andamento').length,
      concluidas: metas.filter(m => m.status === 'concluida').length,
      total: metas.length
    };
    
    return { metas, resumo };
  }

  async detalhes(id_meta: number): Promise<MetaModel> {
    const response = await api.get(`/metas/detalhes/${id_meta}`);
    const payload = response.data;
    const dados = payload?.dados ?? payload;
    const meta = dados?.meta ?? dados;
    const apiMeta: MetaAPI = {
      id_meta: meta.id_meta,
      titulo: meta.titulo,
      descricao: meta.descricao ?? undefined,
      tipo: meta.tipo,
      contexto: meta.contexto,
      data_inicio: meta.data_inicio ?? undefined,
      data_fim: meta.data_fim ?? undefined,
      status: meta.status,
      prioridade: meta.prioridade,
      progresso: dados?.progresso ?? { total: 0, concluidas: 0, percentual: 0 },
      tarefas: dados?.tarefas ?? [],
      created_at: meta.created_at,
    };
    return mapMetaAPIToModel(apiMeta);
  }

  async criar(payload: {
    titulo: string;
    descricao?: string;
    tipo: "diaria" | "mensal" | "anual";
    contexto: string;
    prioridade?: "baixa" | "media" | "alta";
    data_inicio?: string;
    data_fim?: string;
  }): Promise<MetaModel> {
    const body = {
      ...payload,
      data_inicio: this.toISO(payload.data_inicio),
      data_fim: this.toISO(payload.data_fim),
    };
    const response = await api.post("/metas/criar", body);
    const respData = response.data;
    const item: MetaAPI = (respData?.dados ?? respData);
    return mapMetaAPIToModel(item);
  }

  async atualizar(id_meta: number, payload: Partial<{
    titulo: string;
    descricao: string;
    contexto: string;
    prioridade: "baixa" | "media" | "alta";
    status: "pendente" | "em_andamento" | "concluida";
    data_inicio: string;
    data_fim: string;
  }>): Promise<MetaModel> {
    const response = await api.put(`/metas/atualizar/${id_meta}`, payload);
    const data = response.data;
    const item: MetaAPI = (data?.dados ?? data);
    return mapMetaAPIToModel(item);
  }

  async deletar(id_meta: number): Promise<boolean> {
    await api.delete(`/metas/deletar/${id_meta}`);
    return true;
  }

  async criarTarefa(id_meta: number, payload: {
    titulo: string;
    descricao?: string;
  }): Promise<TarefaMetaModel> {
    await api.post(`/metas/${id_meta}/tarefas/criar`, payload);
    const meta = await this.detalhes(id_meta);
    // retorna a última tarefa criada
    return meta.tarefas[meta.tarefas.length - 1];
  }

  async atualizarStatusTarefa(id_meta: number, id_tarefa: number, status: "pendente" | "concluida"): Promise<MetaModel> {
    await api.put(`/metas/${id_meta}/tarefas/${id_tarefa}/status`, { status });
    return this.detalhes(id_meta);
  }
}

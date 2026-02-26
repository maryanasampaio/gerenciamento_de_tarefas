import { useState, useEffect, useCallback } from "react";
import { MetaModel, TarefaMetaModel } from "../models/MetaModel";
import { MetaRepository, ResumoMetas } from "../repository/MetaRepository";
import { notificationService } from "@/services/notificationService";
import { useModal } from "@/context/ModalContext";

const repository = new MetaRepository();
const META_STATUS_OVERRIDES_KEY = "metaStatusOverrides";

type MetaStatus = MetaModel["status"];
type MetaStatusOverrides = Record<number, MetaStatus>;

function lerOverridesStatusMeta(): MetaStatusOverrides {
  try {
    const raw = localStorage.getItem(META_STATUS_OVERRIDES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as MetaStatusOverrides;
  } catch {
    return {};
  }
}

function salvarOverridesStatusMeta(overrides: MetaStatusOverrides) {
  localStorage.setItem(META_STATUS_OVERRIDES_KEY, JSON.stringify(overrides));
}

function definirOverrideStatusMeta(idMeta: number, status: MetaStatus) {
  const overrides = lerOverridesStatusMeta();
  overrides[idMeta] = status;
  salvarOverridesStatusMeta(overrides);
}

function removerOverrideStatusMeta(idMeta: number) {
  const overrides = lerOverridesStatusMeta();
  if (overrides[idMeta] !== undefined) {
    delete overrides[idMeta];
    salvarOverridesStatusMeta(overrides);
  }
}

function aplicarOverridesStatusMetas(metas: MetaModel[]): MetaModel[] {
  const overrides = lerOverridesStatusMeta();
  return metas.map((meta) => {
    const override = overrides[meta.id_meta];
    if (!override) return meta;
    if ((meta.tarefas?.length ?? 0) > 0) return meta;
    return { ...meta, status: override };
  });
}

function calcularResumoLocal(metas: MetaModel[]): ResumoMetas {
  return {
    pendentes: metas.filter((m) => m.status === "pendente").length,
    em_andamento: metas.filter((m) => m.status === "andamento").length,
    concluidas: metas.filter((m) => m.status === "concluida").length,
    total: metas.length,
  };
}

export function useMetaViewModel() {
  const modal = useModal();
  const [metas, setMetas] = useState<MetaModel[]>([]);
  const [resumo, setResumo] = useState<ResumoMetas>({
    pendentes: 0,
    em_andamento: 0,
    concluidas: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState<MetaModel | null>(null);

  useEffect(() => {
    // inicial: não carrega nada automaticamente; carregamento ocorre via getMetasPorTipo
  }, []);

  const abrirModalCriar = () => {
    setModalCriarAberto(true);
  };

  const fecharModalCriar = () => {
    setModalCriarAberto(false);
  };

  const abrirModalVisualizar = (meta: MetaModel) => {
    setMetaSelecionada(meta);
    setModalVisualizarAberto(true);
  };

  const fecharModalVisualizar = () => {
    setModalVisualizarAberto(false);
    setMetaSelecionada(null);
  };

  const criarMeta = useCallback(async (dados: Partial<MetaModel>) => {
    setLoading(true);
    try {
      const nova = await repository.criar({
        titulo: dados.titulo || '',
        descricao: dados.descricao,
        tipo: dados.tipo || 'diaria',
        contexto: dados.contexto || 'outros',
        prioridade: dados.importancia || 'media',
        data_inicio: dados.data_inicio,
        data_fim: dados.data_fim,
      });
      
      // NÃO adiciona localmente - a view fará reload após criação
      // Apenas atualiza o resumo otimisticamente
      setResumo(prev => ({
        ...prev,
        total: prev.total + 1,
        pendentes: prev.pendentes + 1
      }));
      fecharModalCriar();
      
      // Retorna a meta criada para que a view possa recarregar
      return nova;
    } catch (error: any) {
      modal.error("Erro ao criar meta", error.message || "Tente novamente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [modal]);

  const adicionarTarefaNaMeta = useCallback(async (idMeta: number, tarefaDados: Partial<TarefaMetaModel>) => {
    setLoading(true);
    try {
      await repository.criarTarefa(idMeta, { titulo: tarefaDados.titulo || '', descricao: tarefaDados.descricao });
      const detalhes = await repository.detalhes(idMeta);
      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? detalhes : m)));
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(detalhes);
    } catch (error: any) {
      modal.error("Erro ao adicionar tarefa", error.message || "Tente novamente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [metaSelecionada, modal]);

  // Calcular status da meta baseado nas tarefas
  const calcularStatusMeta = (tarefas: TarefaMetaModel[]): 'pendente' | 'andamento' | 'concluida' => {
    if (tarefas.length === 0) return 'pendente';
    
    const todasConcluidas = tarefas.every(t => t.status === 'concluida');
    if (todasConcluidas) return 'concluida';
    
    const algumaEmAndamentoOuConcluida = tarefas.some(t => t.status === 'andamento' || t.status === 'concluida');
    if (algumaEmAndamentoOuConcluida) return 'andamento';
    
    return 'pendente';
  };

  const atualizarStatusTarefa = useCallback(async (idMeta: number, idTarefa: number, novoStatus: 'pendente' | 'andamento' | 'concluida') => {
    setLoading(true);
    try {
      const metaAtualizada = await repository.atualizarStatusTarefa(idMeta, idTarefa, novoStatus === 'andamento' ? 'pendente' : novoStatus);
      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? metaAtualizada : m)));
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(metaAtualizada);
    } catch (error: any) {
      modal.error("Erro ao atualizar", error.message || "Tente novamente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [metaSelecionada, modal]);

  const excluirTarefa = (idMeta: number, idTarefa: number) => {
    // Sem endpoint de exclusão de tarefa no backend: mantém comportamento local por enquanto
    setMetas(prev => prev.map(meta => {
      if (meta.id_meta === idMeta) {
        const tarefasAtualizadas = meta.tarefas.filter(t => t.id_tarefa_meta !== idTarefa);
        const progresso = calcularProgresso(tarefasAtualizadas);
        const statusMeta = calcularStatusMeta(tarefasAtualizadas);
        return { ...meta, tarefas: tarefasAtualizadas, progresso, status: statusMeta };
      }
      return meta;
    }));
    // Não dispara evento - apenas operação local, estado já atualizado

    if (metaSelecionada?.id_meta === idMeta) {
      setMetaSelecionada(prev => {
        if (!prev) return null;
        const tarefasAtualizadas = prev.tarefas.filter(t => t.id_tarefa_meta !== idTarefa);
        const statusMeta = calcularStatusMeta(tarefasAtualizadas);
        return { ...prev, tarefas: tarefasAtualizadas, progresso: calcularProgresso(tarefasAtualizadas), status: statusMeta };
      });
    }
  };

  const excluirMeta = useCallback(async (idMeta: number) => {
    setLoading(true);
    try {
      await repository.deletar(idMeta);
      removerOverrideStatusMeta(idMeta);
      setMetas(prev => prev.filter(m => m.id_meta !== idMeta));
      setResumo(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
      fecharModalVisualizar();
    } catch (error: any) {
      modal.error("Erro ao excluir meta", error.message || "Tente novamente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [modal]);

  const concluirMeta = async (idMeta: number) => {
    setLoading(true);
    try {
      const metaAntes = metas.find(m => m.id_meta === idMeta);

      if (!metaAntes) return;

      let metaAtualizada: MetaModel | null = null;
      
      // Se tem tarefas, marca todas como concluídas (status será auto-gerenciado)
      if (metaAntes?.tarefas && metaAntes.tarefas.length > 0) {
        for (const tarefa of metaAntes.tarefas) {
          if (tarefa.status !== 'concluida') {
            await repository.atualizarStatusTarefa(idMeta, tarefa.id_tarefa_meta, 'concluida');
          }
        }
        // Recarregar meta (status recalculado pelo backend)
        metaAtualizada = await repository.detalhes(idMeta);
        removerOverrideStatusMeta(idMeta);
      } else {
        metaAtualizada = await repository.atualizar(idMeta, { status: 'concluida' });
        metaAtualizada = { ...metaAtualizada, status: 'concluida' };
        definirOverrideStatusMeta(idMeta, 'concluida');
      }
      
      if (!metaAtualizada) return;

      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? metaAtualizada : m)));
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(metaAtualizada);
      
      // 🎉 Disparar celebração ao concluir meta
      if (metaAntes && metaAtualizada.status === 'concluida') {
        const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
        if (settings.enabled && settings.celebrations) {
          const tasksCount = metaAntes.tarefas?.length || 0;
          const taskWord = tasksCount === 1 ? 'tarefa' : 'tarefas';
          const message = tasksCount > 0 
            ? `Meta "${metaAntes.titulo}" concluída com ${tasksCount} ${taskWord}! 🎯✨`
            : `Meta "${metaAntes.titulo}" concluída! 🎯✨`;
          await notificationService.notifyCelebration(message);
        }
      }
    } catch (error: any) {
      modal.error("Erro ao concluir meta", error.message || "Tente novamente");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const alternarConclusaoMeta = useCallback(async (idMeta: number) => {
    setLoading(true);
    try {
      const atual = metas.find(m => m.id_meta === idMeta);
      if (!atual) return;

      const querConcluir = atual?.status !== 'concluida';

      let metaAtualizada: MetaModel | null = null;
      
      // Se tem tarefas, atualiza através delas
      if (atual?.tarefas && atual.tarefas.length > 0) {
        if (querConcluir) {
          // Marcar todas as tarefas como concluídas
          for (const tarefa of atual.tarefas) {
            if (tarefa.status !== 'concluida') {
              await repository.atualizarStatusTarefa(idMeta, tarefa.id_tarefa_meta, 'concluida');
            }
          }
        } else {
          // Marcar todas as tarefas como pendentes
          for (const tarefa of atual.tarefas) {
            if (tarefa.status !== 'pendente') {
              await repository.atualizarStatusTarefa(idMeta, tarefa.id_tarefa_meta, 'pendente');
            }
          }
        }
        // Recarregar meta (status recalculado pelo backend)
        metaAtualizada = await repository.detalhes(idMeta);
        removerOverrideStatusMeta(idMeta);
      } else {
        const novoStatus = querConcluir ? 'concluida' : 'pendente';
        metaAtualizada = await repository.atualizar(idMeta, { status: novoStatus });
        metaAtualizada = { ...metaAtualizada, status: novoStatus };
        definirOverrideStatusMeta(idMeta, novoStatus);
      }
      
      if (!metaAtualizada) return;

      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? metaAtualizada : m)));
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(metaAtualizada);
      
      // 🎉 Disparar celebração ao concluir meta
      if (atual && metaAtualizada.status === 'concluida' && querConcluir) {
        const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
        if (settings.enabled && settings.celebrations) {
          const tasksCount = atual.tarefas?.length || 0;
          const taskWord = tasksCount === 1 ? 'tarefa' : 'tarefas';
          const message = tasksCount > 0 
            ? `Meta "${atual.titulo}" concluída com ${tasksCount} ${taskWord}! 🎯✨`
            : `Meta "${atual.titulo}" concluída! 🎯✨`;
          await notificationService.notifyCelebration(message);
        }
      }
      
      // Atualizar resumo baseado no status anterior e novo
      if (atual) {
        setResumo(prev => {
          const novo = { ...prev };
          
          // Decrementar do status anterior
          if (atual.status === 'concluida') {
            novo.concluidas = Math.max(0, novo.concluidas - 1);
          } else if (atual.status === 'andamento') {
            novo.em_andamento = Math.max(0, novo.em_andamento - 1);
          } else {
            novo.pendentes = Math.max(0, novo.pendentes - 1);
          }
          
          // Incrementar no novo status (vindo do backend)
          if (metaAtualizada.status === 'concluida') {
            novo.concluidas += 1;
          } else if (metaAtualizada.status === 'andamento') {
            novo.em_andamento += 1;
          } else {
            novo.pendentes += 1;
          }
          
          return novo;
        });
      }
    } catch (error: any) {
      modal.error("Erro ao atualizar meta", error.message || "Tente novamente");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [metas, metaSelecionada, modal]);

  const calcularProgresso = (tarefas: TarefaMetaModel[]): number => {
    if (tarefas.length === 0) return 0;
    const concluidas = tarefas.filter(t => t.status === 'concluida').length;
    return Math.round((concluidas / tarefas.length) * 100);
  };

  const carregarMetas = useCallback(async (
    tipo: 'diaria' | 'mensal' | 'anual', 
    data?: string,
    filtros?: {
      status?: 'pendente' | 'em_andamento' | 'concluida';
      prioridade?: 'alta' | 'media' | 'baixa';
      pesquisa?: string;
    }
  ) => {
    setLoading(true);
    try {
      const response = await repository.listar(tipo, { 
        data,
        status: filtros?.status,
        prioridade: filtros?.prioridade,
        pesquisa: filtros?.pesquisa
      });
      const metasComOverride = aplicarOverridesStatusMetas(response.metas);
      setMetas(metasComOverride);
      setResumo(calcularResumoLocal(metasComOverride));
    } catch (error: any) {
      if (error?.code === 'ECONNABORTED') {
        modal.error("Conexão lenta", "A listagem demorou para responder. Tente novamente.");
      } else {
        modal.error("Erro ao carregar metas", error?.message || "Tente novamente");
      }
    } finally {
      setLoading(false);
    }
  }, [modal]);

  const carregarMetaPorId = async (idMeta: number) => {
    setLoading(true);
    try {
      const detalhes = await repository.detalhes(idMeta);
      const [detalhesComOverride] = aplicarOverridesStatusMetas([detalhes]);
      setMetas(prev => {
        const existe = prev.some(m => m.id_meta === idMeta);
        return existe ? prev.map(m => (m.id_meta === idMeta ? detalhesComOverride : m)) : [...prev, detalhesComOverride];
      });
      setMetaSelecionada(detalhesComOverride);
    } finally {
      setLoading(false);
    }
  };

  const getMetasPorTipo = (tipo: 'diaria' | 'mensal' | 'anual', data?: string) => {
    let metasFiltradas = metas.filter(m => m.tipo === tipo);

    // Helper para converter datas ISO/strings em formato pt-BR (DD/MM/AAAA)
    const toPtBrDate = (value?: string): string | null => {
      if (!value) return null;
      if (value.includes('/')) return value; // já está em DD/MM/AAAA
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
      return null;
    };

    // Para 'diaria', reforça o filtro pelo dia usando created_at quando disponível
    if (tipo === 'diaria' && data) {
      metasFiltradas = metasFiltradas.filter(m => {
        const created = toPtBrDate(m.created_at);
        const inicio = m.data_inicio || null; // já normalizado em pt-BR pelo mapper
        // Compara por created_at; se ausente ou inválido, cai para data_inicio
        if (created) return created === data;
        if (inicio) return inicio === data;
        return true; // se sem datas, mantém (evita esconder indevidamente)
      });
    }
    if (tipo === 'mensal' && data) {
      const [mes, ano] = data.split('/');
      metasFiltradas = metasFiltradas.filter(m => {
        const [, mesInicio, anoInicio] = m.data_inicio.split('/');
        return mesInicio === mes && anoInicio === ano;
      });
    }
    if (tipo === 'anual' && data) {
      metasFiltradas = metasFiltradas.filter(m => {
        const [,, ano] = m.data_inicio.split('/');
        return ano === data;
      });
    }
    return metasFiltradas;
  };

  return {
    metas,
    resumo,
    loading,
    modalCriarAberto,
    modalVisualizarAberto,
    metaSelecionada,
    abrirModalCriar,
    fecharModalCriar,
    abrirModalVisualizar,
    fecharModalVisualizar,
    criarMeta,
    adicionarTarefaNaMeta,
    atualizarStatusTarefa,
    excluirTarefa,
    excluirMeta,
    concluirMeta,
    alternarConclusaoMeta,
    carregarMetaPorId,
    carregarMetas,
    getMetasPorTipo
  } as const;
}

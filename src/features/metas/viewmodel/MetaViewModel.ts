import { useState, useEffect, useCallback } from "react";
import { MetaModel, TarefaMetaModel } from "../models/MetaModel";
import { MetaRepository, ResumoMetas } from "../repository/MetaRepository";
import { notificationService } from "@/services/notificationService";

const repository = new MetaRepository();

export function useMetaViewModel() {
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
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarTarefaNaMeta = useCallback(async (idMeta: number, tarefaDados: Partial<TarefaMetaModel>) => {
    setLoading(true);
    try {
      await repository.criarTarefa(idMeta, { titulo: tarefaDados.titulo || '', descricao: tarefaDados.descricao });
      const detalhes = await repository.detalhes(idMeta);
      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? detalhes : m)));
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(detalhes);
    } finally {
      setLoading(false);
    }
  }, [metaSelecionada]);

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
    } finally {
      setLoading(false);
    }
  }, [metaSelecionada]);

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
      setMetas(prev => prev.filter(m => m.id_meta !== idMeta));
      setResumo(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
      fecharModalVisualizar();
    } finally {
      setLoading(false);
    }
  }, []);

  const concluirMeta = async (idMeta: number) => {
    setLoading(true);
    try {
      const metaAntes = metas.find(m => m.id_meta === idMeta);
      const atualizada = await repository.atualizar(idMeta, { status: 'concluida' });
      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? atualizada : m)));
      
      // 🎉 Disparar celebração ao concluir meta
      if (metaAntes) {
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
      
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(atualizada);
    } finally {
      setLoading(false);
    }
  };

  const alternarConclusaoMeta = useCallback(async (idMeta: number) => {
    setLoading(true);
    try {
      const atual = metas.find(m => m.id_meta === idMeta);
      const novoStatus = atual?.status === 'concluida' ? 'pendente' : 'concluida';
      const atualizada = await repository.atualizar(idMeta, { status: novoStatus });
      setMetas(prev => prev.map(m => (m.id_meta === idMeta ? atualizada : m)));
      
      // 🎉 Disparar celebração ao concluir meta
      if (atual && novoStatus === 'concluida') {
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
          
          // Incrementar no novo status
          if (novoStatus === 'concluida') {
            novo.concluidas += 1;
          } else {
            novo.pendentes += 1;
          }
          
          return novo;
        });
      }
      
      if (metaSelecionada?.id_meta === idMeta) setMetaSelecionada(atualizada);
    } finally {
      setLoading(false);
    }
  }, [metas, metaSelecionada]);

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
      setMetas(response.metas);
      setResumo(response.resumo);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const carregarMetaPorId = async (idMeta: number) => {
    setLoading(true);
    try {
      const detalhes = await repository.detalhes(idMeta);
      setMetas(prev => {
        const existe = prev.some(m => m.id_meta === idMeta);
        return existe ? prev.map(m => (m.id_meta === idMeta ? detalhes : m)) : [...prev, detalhes];
      });
      setMetaSelecionada(detalhes);
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

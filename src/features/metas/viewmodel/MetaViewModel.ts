import { useState, useEffect } from "react";
import { MetaModel, TarefaMetaModel } from "../models/MetaModel";

// Dados mockados iniciais
const metasMockadas: MetaModel[] = [
  {
    id_meta: 1,
    titulo: "Aprender TypeScript Avançado",
    descricao: "Dominar conceitos avançados de TypeScript para melhorar a qualidade do código",
    tipo: 'mensal',
    contexto: 'estudos',
    data_inicio: "01/01/2026",
    data_fim: "31/01/2026",
    status: 'andamento',
    importancia: 'alta',
    progresso: 60,
    tarefas: [
      {
        id_tarefa_meta: 1,
        id_meta: 1,
        titulo: "Estudar Generics",
        descricao: "Entender e praticar o uso de generics",
        status: 'concluida',
        data_conclusao: "15/01/2026",
        created_at: "2026-01-01T10:00:00"
      },
      {
        id_tarefa_meta: 2,
        id_meta: 1,
        titulo: "Praticar Decorators",
        descricao: "Implementar decorators em projetos práticos",
        status: 'andamento',
        created_at: "2026-01-10T10:00:00"
      }
    ],
    created_at: "2026-01-01T10:00:00"
  }
];

export function useMetaViewModel() {
  const [metas, setMetas] = useState<MetaModel[]>(() => {
    // Carregar do localStorage se existir
    const saved = localStorage.getItem('metas_mockadas');
    return saved ? JSON.parse(saved) : metasMockadas;
  });
  const [loading, setLoading] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalVisualizarAberto, setModalVisualizarAberto] = useState(false);
  const [metaSelecionada, setMetaSelecionada] = useState<MetaModel | null>(null);

  // Salvar no localStorage sempre que metas mudarem
  useEffect(() => {
    localStorage.setItem('metas_mockadas', JSON.stringify(metas));
  }, [metas]);

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

  const criarMeta = (dados: Partial<MetaModel>) => {
    const novaMeta: MetaModel = {
      id_meta: Date.now(),
      titulo: dados.titulo || '',
      descricao: dados.descricao || '',
      tipo: dados.tipo || 'diaria',
      contexto: dados.contexto || 'outros',
      data_inicio: dados.data_inicio || new Date().toLocaleDateString('pt-BR'),
      data_fim: dados.data_fim || new Date().toLocaleDateString('pt-BR'),
      status: 'pendente',
      importancia: dados.importancia || 'media',
      progresso: 0,
      tarefas: [],
      created_at: new Date().toISOString()
    };

    setMetas(prev => [...prev, novaMeta]);
    fecharModalCriar();
  };

  const adicionarTarefaNaMeta = (idMeta: number, tarefaDados: Partial<TarefaMetaModel>) => {
    const novaTarefa: TarefaMetaModel = {
      id_tarefa_meta: Date.now(),
      id_meta: idMeta,
      titulo: tarefaDados.titulo || '',
      descricao: tarefaDados.descricao || '',
      status: tarefaDados.status || 'pendente',
      importancia: tarefaDados.importancia || 'media',
      created_at: new Date().toISOString()
    };

    setMetas(prev => prev.map(meta => {
      if (meta.id_meta === idMeta) {
        const novasTarefas = [...meta.tarefas, novaTarefa];
        const progresso = calcularProgresso(novasTarefas);
        const statusMeta = calcularStatusMeta(novasTarefas);
        return { ...meta, tarefas: novasTarefas, progresso, status: statusMeta };
      }
      return meta;
    }));

    // Atualizar meta selecionada se estiver visualizando
    if (metaSelecionada?.id_meta === idMeta) {
      setMetaSelecionada(prev => {
        if (!prev) return null;
        const novasTarefas = [...prev.tarefas, novaTarefa];
        const statusMeta = calcularStatusMeta(novasTarefas);
        return { ...prev, tarefas: novasTarefas, progresso: calcularProgresso(novasTarefas), status: statusMeta };
      });
    }
  };

  // Calcular status da meta baseado nas tarefas
  const calcularStatusMeta = (tarefas: TarefaMetaModel[]): 'pendente' | 'andamento' | 'concluida' => {
    if (tarefas.length === 0) return 'pendente';
    
    const todasConcluidas = tarefas.every(t => t.status === 'concluida');
    if (todasConcluidas) return 'concluida';
    
    const algumaEmAndamentoOuConcluida = tarefas.some(t => t.status === 'andamento' || t.status === 'concluida');
    if (algumaEmAndamentoOuConcluida) return 'andamento';
    
    return 'pendente';
  };

  const atualizarStatusTarefa = (idMeta: number, idTarefa: number, novoStatus: 'pendente' | 'andamento' | 'concluida') => {
    setMetas(prev => prev.map(meta => {
      if (meta.id_meta === idMeta) {
        const tarefasAtualizadas = meta.tarefas.map(tarefa => {
          if (tarefa.id_tarefa_meta === idTarefa) {
            return {
              ...tarefa,
              status: novoStatus,
              data_conclusao: novoStatus === 'concluida' ? new Date().toLocaleDateString('pt-BR') : undefined
            };
          }
          return tarefa;
        });
        const progresso = calcularProgresso(tarefasAtualizadas);
        const statusMeta = calcularStatusMeta(tarefasAtualizadas);
        return { ...meta, tarefas: tarefasAtualizadas, progresso, status: statusMeta };
      }
      return meta;
    }));

    // Atualizar meta selecionada
    if (metaSelecionada?.id_meta === idMeta) {
      setMetaSelecionada(prev => {
        if (!prev) return null;
        const tarefasAtualizadas = prev.tarefas.map(tarefa => {
          if (tarefa.id_tarefa_meta === idTarefa) {
            return {
              ...tarefa,
              status: novoStatus,
              data_conclusao: novoStatus === 'concluida' ? new Date().toLocaleDateString('pt-BR') : undefined
            };
          }
          return tarefa;
        });
        const progresso = calcularProgresso(tarefasAtualizadas);
        const statusMeta = calcularStatusMeta(tarefasAtualizadas);
        return { ...prev, tarefas: tarefasAtualizadas, progresso, status: statusMeta };
      });
    }
  };

  const excluirTarefa = (idMeta: number, idTarefa: number) => {
    setMetas(prev => prev.map(meta => {
      if (meta.id_meta === idMeta) {
        const tarefasAtualizadas = meta.tarefas.filter(t => t.id_tarefa_meta !== idTarefa);
        const progresso = calcularProgresso(tarefasAtualizadas);
        const statusMeta = calcularStatusMeta(tarefasAtualizadas);
        return { ...meta, tarefas: tarefasAtualizadas, progresso, status: statusMeta };
      }
      return meta;
    }));

    // Atualizar meta selecionada
    if (metaSelecionada?.id_meta === idMeta) {
      setMetaSelecionada(prev => {
        if (!prev) return null;
        const tarefasAtualizadas = prev.tarefas.filter(t => t.id_tarefa_meta !== idTarefa);
        const statusMeta = calcularStatusMeta(tarefasAtualizadas);
        return { ...prev, tarefas: tarefasAtualizadas, progresso: calcularProgresso(tarefasAtualizadas), status: statusMeta };
      });
    }
  };

  const excluirMeta = (idMeta: number) => {
    setMetas(prev => prev.filter(m => m.id_meta !== idMeta));
    fecharModalVisualizar();
  };

  const concluirMeta = (idMeta: number) => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    setMetas(prev => prev.map(meta => {
      if (meta.id_meta === idMeta) {
        // Marcar todas as tarefas como concluídas
        const tarefasAtualizadas = meta.tarefas.map(tarefa => ({
          ...tarefa,
          status: 'concluida' as const,
          data_conclusao: tarefa.data_conclusao || dataAtual
        }));
        
        return {
          ...meta,
          tarefas: tarefasAtualizadas,
          status: 'concluida' as const,
          progresso: 100
        };
      }
      return meta;
    }));

    // Atualizar meta selecionada
    if (metaSelecionada?.id_meta === idMeta) {
      setMetaSelecionada(prev => {
        if (!prev) return null;
        const tarefasAtualizadas = prev.tarefas.map(tarefa => ({
          ...tarefa,
          status: 'concluida' as const,
          data_conclusao: tarefa.data_conclusao || dataAtual
        }));
        
        return {
          ...prev,
          tarefas: tarefasAtualizadas,
          status: 'concluida' as const,
          progresso: 100
        };
      });
    }
  };

  const alternarConclusaoMeta = (idMeta: number) => {
    setMetas(prev => prev.map(meta => {
      if (meta.id_meta === idMeta) {
        if (meta.status === 'concluida') {
          // Desconcluir: voltar todas as tarefas para pendente
          const tarefasAtualizadas = meta.tarefas.map(tarefa => ({
            ...tarefa,
            status: 'pendente' as const,
            data_conclusao: undefined
          }));
          
          return {
            ...meta,
            tarefas: tarefasAtualizadas,
            status: 'pendente' as const,
            progresso: 0
          };
        } else {
          // Concluir: marcar todas as tarefas como concluídas
          const dataAtual = new Date().toLocaleDateString('pt-BR');
          const tarefasAtualizadas = meta.tarefas.map(tarefa => ({
            ...tarefa,
            status: 'concluida' as const,
            data_conclusao: tarefa.data_conclusao || dataAtual
          }));
          
          return {
            ...meta,
            tarefas: tarefasAtualizadas,
            status: 'concluida' as const,
            progresso: 100
          };
        }
      }
      return meta;
    }));
  };

  const calcularProgresso = (tarefas: TarefaMetaModel[]): number => {
    if (tarefas.length === 0) return 0;
    const concluidas = tarefas.filter(t => t.status === 'concluida').length;
    return Math.round((concluidas / tarefas.length) * 100);
  };

  const getMetasPorTipo = (tipo: 'diaria' | 'mensal' | 'anual', data?: string) => {
    let metasFiltradas = metas.filter(m => m.tipo === tipo);

    // Filtro adicional por data se fornecido (para metas diárias)
    if (tipo === 'diaria' && data) {
      metasFiltradas = metasFiltradas.filter(m => m.data_inicio === data);
    }

    // Para metas mensais, filtrar pelo mês/ano
    if (tipo === 'mensal' && data) {
      const [dia, mes, ano] = data.split('/');
      metasFiltradas = metasFiltradas.filter(m => {
        const [diaInicio, mesInicio, anoInicio] = m.data_inicio.split('/');
        return mesInicio === mes && anoInicio === ano;
      });
    }

    // Para metas anuais, filtrar pelo ano
    if (tipo === 'anual' && data) {
      metasFiltradas = metasFiltradas.filter(m => {
        const [dia, mes, ano] = m.data_inicio.split('/');
        return ano === data;
      });
    }

    return metasFiltradas;
  };

  return {
    metas,
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
    getMetasPorTipo
  };
}

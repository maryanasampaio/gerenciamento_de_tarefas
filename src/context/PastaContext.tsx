import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { PastaModel, BlocoConteudo, ResumoEstudo } from '@/features/pastas/models/PastaModel';

interface PastaContextType {
  pastas: PastaModel[];
  pastaSelecionada: PastaModel | null;
  criarPasta: (titulo: string) => PastaModel;
  selecionarPasta: (id: string) => void;
  atualizarPasta: (id: string, dados: Partial<PastaModel>) => void;
  excluirPasta: (id: string) => void;
  adicionarBloco: (pastaId: string, bloco: Omit<BlocoConteudo, 'id' | 'ordem'>) => void;
  inserirBlocoApos: (pastaId: string, blocoAnteriorId: string, bloco: Omit<BlocoConteudo, 'id' | 'ordem'>) => string;
  atualizarBloco: (pastaId: string, blocoId: string, dados: Partial<BlocoConteudo>) => void;
  removerBloco: (pastaId: string, blocoId: string) => void;
  reordenarBlocos: (pastaId: string, blocos: BlocoConteudo[]) => void;
  // Funções para resumos de estudo
  criarResumo: (pastaId: string, titulo: string) => ResumoEstudo;
  atualizarResumo: (pastaId: string, resumoId: string, dados: Partial<ResumoEstudo>) => void;
  excluirResumo: (pastaId: string, resumoId: string) => void;
}

const PastaContext = createContext<PastaContextType | undefined>(undefined);

export const PastaProvider = ({ children }: { children: ReactNode }) => {
  const [pastas, setPastas] = useState<PastaModel[]>(() => {
    // Carregar pastas do localStorage (temporário, enquanto não tem backend)
    const saved = localStorage.getItem('pastas_personalizadas');
    return saved ? JSON.parse(saved) : [];
  });
  const [pastaSelecionada, setPastaSelecionada] = useState<PastaModel | null>(null);

  // Salvar no localStorage quando pastas mudarem
  useEffect(() => {
    localStorage.setItem('pastas_personalizadas', JSON.stringify(pastas));
  }, [pastas]);

  const detectarContextoEstudo = (titulo: string): boolean => {
    const palavrasEstudo = [
      'estudo', 'estudar', 'estudos', 'aula', 'curso', 'aprender', 
      'matéria', 'disciplina', 'prova', 'exame', 'resumo', 'revisão',
      'faculdade', 'universidade', 'escola', 'colégio', 'matemática',
      'física', 'química', 'biologia', 'história', 'geografia', 'português',
      'inglês', 'literatura', 'filosofia', 'sociologia', 'leitura', 'livro',
      'apostila', 'conteúdo', 'teoria', 'prática', 'exercício'
    ];
    
    const tituloLower = titulo.toLowerCase();
    return palavrasEstudo.some(palavra => tituloLower.includes(palavra));
  };

  const gerarIconeECor = (titulo: string) => {
    const tituloLower = titulo.toLowerCase();
    
    // Ícones baseados em contexto
    if (detectarContextoEstudo(titulo)) {
      return { icone: '📚', cor: 'from-blue-500 to-indigo-600' };
    }
    if (tituloLower.includes('trabalho') || tituloLower.includes('projeto')) {
      return { icone: '💼', cor: 'from-purple-500 to-pink-600' };
    }
    if (tituloLower.includes('pessoal') || tituloLower.includes('diário')) {
      return { icone: '📝', cor: 'from-green-500 to-teal-600' };
    }
    if (tituloLower.includes('ideias') || tituloLower.includes('brainstorm')) {
      return { icone: '💡', cor: 'from-yellow-500 to-orange-600' };
    }
    if (tituloLower.includes('código') || tituloLower.includes('programação')) {
      return { icone: '💻', cor: 'from-gray-600 to-slate-700' };
    }
    if (tituloLower.includes('receita') || tituloLower.includes('comida')) {
      return { icone: '🍳', cor: 'from-red-500 to-orange-500' };
    }
    if (tituloLower.includes('viagem') || tituloLower.includes('roteiro')) {
      return { icone: '✈️', cor: 'from-sky-500 to-blue-600' };
    }
    
    // Ícone padrão
    return { icone: '📁', cor: 'from-gray-500 to-gray-600' };
  };

  const criarPasta = (titulo: string): PastaModel => {
    const { icone, cor } = gerarIconeECor(titulo);
    const isEstudo = detectarContextoEstudo(titulo);
    
    // Bloco de texto padrão
    const blocoTextoParadao: BlocoConteudo = {
      id: Date.now().toString(),
      tipo: 'texto',
      conteudo: '',
      ordem: 0
    };
    
    const novaPasta: PastaModel = {
      id: Date.now().toString(),
      titulo,
      icone,
      cor,
      blocos: [blocoTextoParadao],
      criadoEm: new Date(),
      atualizadoEm: new Date(),
      isEstudo,
      tempoEstudo: 0
    };

    setPastas(prev => [...prev, novaPasta]);
    return novaPasta;
  };

  const selecionarPasta = (id: string) => {
    const pasta = pastas.find(p => p.id === id);
    setPastaSelecionada(pasta || null);
  };

  const atualizarPasta = (id: string, dados: Partial<PastaModel>) => {
    setPastas(prev =>
      prev.map(pasta =>
        pasta.id === id
          ? { ...pasta, ...dados, atualizadoEm: new Date() }
          : pasta
      )
    );
    
    if (pastaSelecionada?.id === id) {
      setPastaSelecionada(prev => 
        prev ? { ...prev, ...dados, atualizadoEm: new Date() } : null
      );
    }
  };

  const excluirPasta = (id: string) => {
    setPastas(prev => prev.filter(pasta => pasta.id !== id));
    if (pastaSelecionada?.id === id) {
      setPastaSelecionada(null);
    }
  };

  const adicionarBloco = (pastaId: string, bloco: Omit<BlocoConteudo, 'id' | 'ordem'>) => {
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          const novoBloco: BlocoConteudo = {
            ...bloco,
            id: Date.now().toString(),
            ordem: pasta.blocos.length
          };
          return {
            ...pasta,
            blocos: [...pasta.blocos, novoBloco],
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );
    
    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
  };

  const inserirBlocoApos = (pastaId: string, blocoAnteriorId: string, bloco: Omit<BlocoConteudo, 'id' | 'ordem'>): string => {
    const novoId = Date.now().toString();
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          const idx = pasta.blocos.findIndex(b => b.id === blocoAnteriorId);
          const posInsercao = idx === -1 ? pasta.blocos.length : idx + 1;
          const novoBloco: BlocoConteudo = {
            ...bloco,
            id: novoId,
            ordem: posInsercao
          };
          const novosBlocos = [...pasta.blocos];
          novosBlocos.splice(posInsercao, 0, novoBloco);
          // Reordenar
          novosBlocos.forEach((b, i) => b.ordem = i);
          return { ...pasta, blocos: novosBlocos, atualizadoEm: new Date() };
        }
        return pasta;
      })
    );

    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
    return novoId;
  };

  const atualizarBloco = (pastaId: string, blocoId: string, dados: Partial<BlocoConteudo>) => {
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            blocos: pasta.blocos.map(bloco =>
              bloco.id === blocoId ? { ...bloco, ...dados } : bloco
            ),
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );
    
    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
  };

  const removerBloco = (pastaId: string, blocoId: string) => {
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            blocos: pasta.blocos.filter(bloco => bloco.id !== blocoId),
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );
    
    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
  };

  const reordenarBlocos = (pastaId: string, blocos: BlocoConteudo[]) => {
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            blocos: blocos.map((bloco, index) => ({ ...bloco, ordem: index })),
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );
    
    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
  };

  // Funções para gerenciar resumos de estudo
  const criarResumo = (pastaId: string, titulo: string): ResumoEstudo => {
    const novoResumo: ResumoEstudo = {
      id: Date.now().toString(),
      titulo,
      conteudo: '',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            resumos: [...(pasta.resumos || []), novoResumo],
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );

    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }

    return novoResumo;
  };

  const atualizarResumo = (pastaId: string, resumoId: string, dados: Partial<ResumoEstudo>) => {
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            resumos: (pasta.resumos || []).map(resumo =>
              resumo.id === resumoId 
                ? { ...resumo, ...dados, atualizadoEm: new Date() } 
                : resumo
            ),
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );

    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
  };

  const excluirResumo = (pastaId: string, resumoId: string) => {
    setPastas(prev =>
      prev.map(pasta => {
        if (pasta.id === pastaId) {
          return {
            ...pasta,
            resumos: (pasta.resumos || []).filter(resumo => resumo.id !== resumoId),
            atualizadoEm: new Date()
          };
        }
        return pasta;
      })
    );

    if (pastaSelecionada?.id === pastaId) {
      selecionarPasta(pastaId);
    }
  };

  const contextValue = useMemo(() => ({
    pastas,
    pastaSelecionada,
    criarPasta,
    selecionarPasta,
    atualizarPasta,
    excluirPasta,
    adicionarBloco,
    inserirBlocoApos,
    atualizarBloco,
    removerBloco,
    reordenarBlocos,
    criarResumo,
    atualizarResumo,
    excluirResumo
  }), [pastas, pastaSelecionada]);

  return (
    <PastaContext.Provider value={contextValue}>
      {children}
    </PastaContext.Provider>
  );
};

export const usePastas = () => {
  const context = useContext(PastaContext);
  if (context === undefined) {
    throw new Error('usePastas deve ser usado dentro de PastaProvider');
  }
  return context;
};

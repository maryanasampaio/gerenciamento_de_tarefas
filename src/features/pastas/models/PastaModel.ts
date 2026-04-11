export interface BlocoConteudo {
  id: string;
  tipo: 'texto' | 'titulo' | 'lista' | 'checklist' | 'codigo' | 'citacao' | 'resumo';
  conteudo: string;
  completado?: boolean; // Para checklist
  ordem: number;
}

export interface ResumoEstudo {
  id: string;
  titulo: string;
  conteudo: string; // HTML do editor rico
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface PastaModel {
  id: string;
  titulo: string;
  icone: string;
  cor: string;
  blocos: BlocoConteudo[];
  resumos?: ResumoEstudo[]; // Lista de resumos para pastas de estudo
  criadoEm: Date;
  atualizadoEm: Date;
  // Campos para funcionalidades de estudo
  isEstudo?: boolean;
  tempoEstudo?: number; // em minutos
}

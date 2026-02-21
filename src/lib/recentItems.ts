// Gerenciamento de itens recentes (metas e tarefas)

export interface RecentItem {
  id: number;
  tipo: 'meta' | 'tarefa';
  titulo: string;
  contexto?: string;
  timestamp: number;
  status?: string;
  importancia?: string;
  data?: string;
}

const STORAGE_KEY = 'recentItems';
const MAX_ITEMS = 10;

/**
 * Adiciona um item à lista de recentes
 */
export const addRecentItem = (item: Omit<RecentItem, 'timestamp'>): void => {
  try {
    const items = getRecentItems();
    
    // Remove o item se já existir (para evitar duplicatas)
    const filteredItems = items.filter(
      i => !(i.id === item.id && i.tipo === item.tipo)
    );
    
    // Adiciona o novo item no início
    const newItems = [
      { ...item, timestamp: Date.now() },
      ...filteredItems
    ].slice(0, MAX_ITEMS); // Mantém apenas os 10 mais recentes
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    
    // Dispara evento customizado para atualizar outros componentes
    window.dispatchEvent(new Event('recentItemsChanged'));
  } catch (error) {
    console.error('Erro ao adicionar item recente:', error);
  }
};

/**
 * Recupera todos os itens recentes ordenados por timestamp (mais recente primeiro)
 */
export const getRecentItems = (): RecentItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const items: RecentItem[] = JSON.parse(stored);
    // Ordena por timestamp decrescente (mais recente primeiro)
    return items.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Erro ao recuperar itens recentes:', error);
    return [];
  }
};

/**
 * Recupera apenas os N itens mais recentes
 */
export const getTopRecentItems = (limit: number = 4): RecentItem[] => {
  return getRecentItems().slice(0, limit);
};

/**
 * Limpa todos os itens recentes
 */
export const clearRecentItems = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar itens recentes:', error);
  }
};

/**
 * Remove um item específico dos recentes
 */
export const removeRecentItem = (id: number, tipo: 'meta' | 'tarefa'): void => {
  try {
    const items = getRecentItems();
    const filteredItems = items.filter(
      i => !(i.id === id && i.tipo === tipo)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    console.error('Erro ao remover item recente:', error);
  }
};

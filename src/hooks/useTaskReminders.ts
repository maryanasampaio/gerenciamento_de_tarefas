// Hook para integração de notificações com metas e tarefas
import { useEffect } from 'react';
import { useNotifications } from './useNotifications';

interface Meta {
  id?: number;
  id_meta?: number;
  titulo: string;
  prazo?: string | Date;
  data_fim?: string;
  status?: string;
}

interface Tarefa {
  id?: number;
  id_tarefa?: number;
  titulo: string;
  status: string;
  id_meta?: number;
}

/**
 * Hook para gerenciar lembretes automáticos de metas e tarefas
 * 
 * Funcionalidades:
 * 1. Verifica prazos de metas ao carregar
 * 2. Agenda lembrete diário de tarefas pendentes
 * 3. Notifica celebrações ao concluir
 */
export const useTaskReminders = (metas: Meta[], tarefas: Tarefa[]) => {
  const { 
    scheduleDailyReminder, 
    checkUpcomingDeadlines,
    settings 
  } = useNotifications();

  // Verificar prazos de metas ao carregar ou quando metas mudarem
  useEffect(() => {
    if (!settings.enabled || !settings.goalDeadlines) return;
    if (metas.length === 0) return;

    // Filtrar apenas metas não concluídas
    const metasPendentes = metas.filter(meta => 
      meta.status !== 'concluida' && meta.status !== 'completa'
    );

    if (metasPendentes.length > 0) {
      checkUpcomingDeadlines(metasPendentes);
    }
  }, [metas, settings.enabled, settings.goalDeadlines, checkUpcomingDeadlines]);

  // Agendar lembrete diário de tarefas pendentes
  useEffect(() => {
    if (!settings.enabled || !settings.taskReminders) return;
    if (tarefas.length === 0) return;

    // Filtrar apenas tarefas pendentes
    const tarefasPendentes = tarefas.filter(tarefa => 
      tarefa.status !== 'concluida' && tarefa.status !== 'completa'
    );

    if (tarefasPendentes.length > 0) {
      const tarefasParaLembrete = tarefasPendentes.map((tarefa) => ({
        id: tarefa.id ?? tarefa.id_tarefa ?? 0,
        titulo: tarefa.titulo,
      }));

      scheduleDailyReminder(tarefasParaLembrete);
    }
  }, [tarefas, settings.enabled, settings.taskReminders, scheduleDailyReminder]);
};

/**
 * Hook para notificações de celebração ao concluir tarefas/metas
 */
export const useCelebrationNotifications = () => {
  const { notifyCelebration, settings } = useNotifications();

  const celebrateTaskCompletion = async (taskTitle: string) => {
    if (!settings.enabled || !settings.celebrations) return;
    await notifyCelebration(`Tarefa "${taskTitle}" concluída! 🎉`);
  };

  const celebrateGoalCompletion = async (goalTitle: string, tasksCount: number) => {
    if (!settings.enabled || !settings.celebrations) return;
    const taskWord = tasksCount === 1 ? 'tarefa' : 'tarefas';
    const message = tasksCount > 0 
      ? `Meta "${goalTitle}" concluída com ${tasksCount} ${taskWord}! 🎯✨`
      : `Meta "${goalTitle}" concluída! 🎯✨`;
    await notifyCelebration(message);
  };

  const celebrateAllGoalsComplete = async (goalsCount: number) => {
    if (!settings.enabled || !settings.celebrations) return;
    await notifyCelebration(
      `Parabéns! Você concluiu todas as ${goalsCount} ${goalsCount === 1 ? 'meta' : 'metas'}! 🏆🎉`
    );
  };

  return {
    celebrateTaskCompletion,
    celebrateGoalCompletion,
    celebrateAllGoalsComplete
  };
};

/**
 * Hook para verificação periódica de prazos (enquanto app está aberto)
 * 
 * Verifica metas a cada X horas
 */
export const usePeriodicDeadlineCheck = (metas: Meta[], intervalHours: number = 6) => {
  const { checkUpcomingDeadlines, settings } = useNotifications();

  useEffect(() => {
    if (!settings.enabled || !settings.goalDeadlines) return;
    if (metas.length === 0) return;

    // Verificação inicial
    const metasPendentes = metas.filter(meta => 
      meta.status !== 'concluida' && meta.status !== 'completa'
    );
    
    if (metasPendentes.length > 0) {
      checkUpcomingDeadlines(metasPendentes);
    }

    // Verificação periódica
    const intervalMs = intervalHours * 60 * 60 * 1000; // Converter horas para ms
    const interval = setInterval(() => {
      const pending = metas.filter(meta => 
        meta.status !== 'concluida' && meta.status !== 'completa'
      );
      if (pending.length > 0) {
        checkUpcomingDeadlines(pending);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [metas, intervalHours, settings.enabled, settings.goalDeadlines, checkUpcomingDeadlines]);
};

/**
 * Utilitários para calcular informações de prazo
 */
export const deadlineUtils = {
  /**
   * Calcula quantos dias faltam até o prazo
   */
  getDaysUntilDeadline: (prazo: string | Date | undefined): number => {
    if (!prazo) return 999; // Retorna um número alto se não houver prazo
    const deadline = new Date(prazo);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Verifica se a meta está próxima do prazo
   */
  isNearDeadline: (prazo: string | Date | undefined, daysThreshold: number = 3): boolean => {
    const daysLeft = deadlineUtils.getDaysUntilDeadline(prazo);
    return daysLeft > 0 && daysLeft <= daysThreshold;
  },

  /**
   * Verifica se a meta está atrasada
   */
  isOverdue: (prazo: string | Date | undefined): boolean => {
    const daysLeft = deadlineUtils.getDaysUntilDeadline(prazo);
    return daysLeft < 0;
  },

  /**
   * Formata prazo para exibição
   */
  formatDeadlineMessage: (prazo: string | Date | undefined): string => {
    const days = deadlineUtils.getDaysUntilDeadline(prazo);
    
    if (days < 0) return `Atrasada há ${Math.abs(days)} ${Math.abs(days) === 1 ? 'dia' : 'dias'}`;
    if (days === 0) return 'Vence hoje';
    if (days === 1) return 'Vence amanhã';
    return `Vence em ${days} dias`;
  }
};

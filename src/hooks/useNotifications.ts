import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  goalDeadlines: boolean;
  celebrations: boolean;
  reminderTime: string; // HH:MM format
  daysBeforeDeadline: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  taskReminders: true,
  goalDeadlines: true,
  celebrations: true,
  reminderTime: '09:00',
  daysBeforeDeadline: 3
};

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.getPermission());

    // Reprocessar notificações agendadas ao abrir o app
    if (notificationService.getPermission() === 'granted') {
      notificationService.reprocessScheduledNotifications();
    }
  }, []);

  // Salvar configurações
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  }, []);

  // Solicitar permissão
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      setPermission(notificationService.getPermission());
      
      if (granted) {
        saveSettings({ ...settings, enabled: true });
      }
      
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [settings, saveSettings]);

  // Enviar notificação de teste
  const sendTestNotification = useCallback(async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    await notificationService.sendLocalNotification({
      title: '✅ Notificações Ativadas!',
      body: 'Você receberá lembretes de suas tarefas e metas',
      icon: '/logo.png',
      requireInteraction: false
    });
  }, [permission, requestPermission]);

  // Notificar lembrete de tarefa
  const notifyTaskReminder = useCallback(async (taskTitle: string, taskId: number, metaId?: number) => {
    if (!settings.enabled || !settings.taskReminders) return;
    if (permission !== 'granted') return;

    await notificationService.notifyTaskReminder(taskTitle, taskId, metaId);
  }, [settings, permission]);

  // Notificar meta próxima do prazo
  const notifyGoalDeadline = useCallback(async (goalTitle: string, goalId: number, daysLeft: number) => {
    if (!settings.enabled || !settings.goalDeadlines) return;
    if (permission !== 'granted') return;
    if (daysLeft > settings.daysBeforeDeadline) return;

    await notificationService.notifyGoalDeadline(goalTitle, goalId, daysLeft);
  }, [settings, permission]);

  // Notificar celebração
  const notifyCelebration = useCallback(async (message: string) => {
    if (!settings.enabled || !settings.celebrations) return;
    if (permission !== 'granted') return;

    await notificationService.notifyCelebration(message);
  }, [settings, permission]);

  // Agendar lembrete diário
  const scheduleDailyReminder = useCallback((tasks: Array<{ id: number; titulo: string }>) => {
    if (!settings.enabled || !settings.taskReminders) return;
    if (permission !== 'granted') return;
    if (tasks.length === 0) return;

    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);

    // Se já passou, agendar para amanhã
    if (scheduledDate.getTime() < Date.now()) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    const taskCount = tasks.length;
    const taskTitles = tasks.slice(0, 3).map(t => t.titulo).join(', ');
    const taskWord = taskCount === 1 ? 'tarefa' : 'tarefas';
    const body = taskCount <= 3 
      ? `Você tem ${taskCount} ${taskWord}: ${taskTitles}`
      : `Você tem ${taskCount} tarefas pendentes`;

    notificationService.scheduleNotification({
      title: '📋 Tarefas do Dia',
      body,
      icon: '/logo.png',
      tag: 'daily-reminder',
      requireInteraction: true,
      data: {
        type: 'daily-reminder',
        url: '/metas-diarias'
      }
    }, scheduledDate);
  }, [settings, permission]);

  // Verificar metas próximas do prazo
  const checkUpcomingDeadlines = useCallback((goals: Array<{ id?: number; id_meta?: number; titulo: string; prazo?: string | Date; data_fim?: string }>) => {
    if (!settings.enabled || !settings.goalDeadlines) return;
    if (permission !== 'granted') return;

    const now = new Date();
    
    goals.forEach(goal => {
      const prazoValue = goal.data_fim || goal.prazo;
      if (!prazoValue) return; // Pular se não houver prazo
      
      const deadline = new Date(prazoValue);
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Notificar se estiver dentro do prazo configurado
      if (diffDays > 0 && diffDays <= settings.daysBeforeDeadline) {
        const goalId = goal.id_meta || goal.id || 0;
        notifyGoalDeadline(goal.titulo, goalId, diffDays);
      }
    });
  }, [settings, permission, notifyGoalDeadline]);

  // Cancelar todas as notificações
  const cancelAll = useCallback(async () => {
    await notificationService.cancelAllNotifications();
  }, []);

  return {
    permission,
    isSupported,
    settings,
    isLoading,
    saveSettings,
    requestPermission,
    sendTestNotification,
    notifyTaskReminder,
    notifyGoalDeadline,
    notifyCelebration,
    scheduleDailyReminder,
    checkUpcomingDeadlines,
    cancelAll
  };
};

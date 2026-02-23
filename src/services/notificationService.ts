// Serviço de notificações
export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
  timestamp?: number;
}

export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  private constructor() {
    this.permission = this.getPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  isSupported(): boolean {
    return 'Notification' in globalThis && 'serviceWorker' in navigator;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  //  permissão para notificações
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notificações não suportadas neste navegador');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        await this.registerServiceWorker();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  }

  // Registrar service worker
  async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker não suportado');
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registrado:', this.registration);

      // Esperar o service worker estar pronto
      await navigator.serviceWorker.ready;
      
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
      throw error;
    }
  }

  // Enviar notificação local (mesmo com app aberto)
  async sendLocalNotification(config: NotificationConfig): Promise<void> {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        throw new Error('Permissão de notificação negada');
      }
    }

    const options: NotificationOptions = {
      body: config.body,
      icon: config.icon || '/logo.png',
      badge: config.badge || '/logo.png',
      tag: config.tag || `notification-${Date.now()}`,
      requireInteraction: config.requireInteraction ?? false,
      data: config.data,
    };

    if (this.registration) {
      // Usar service worker para notificação (funciona em background)
      await this.registration.showNotification(config.title, options);
    } else {
      // Fallback: notificação direta (só funciona com app aberto)
      new Notification(config.title, options);
    }
  }

  // Agendar notificação para horário específico
  scheduleNotification(config: NotificationConfig, scheduledTime: Date): void {
    const now = new Date().getTime();
    const scheduledTimestamp = scheduledTime.getTime();
    const delay = scheduledTimestamp - now;

    if (delay <= 0) {
      console.warn('Horário agendado já passou');
      return;
    }

    // Salvar no localStorage para persistência
    const scheduled = this.getScheduledNotifications();
    scheduled.push({
      ...config,
      scheduledTime: scheduledTimestamp,
      id: `notif-${Date.now()}`
    });
    localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));

    // Agendar usando setTimeout (funciona apenas com app aberto)
    setTimeout(() => {
      this.sendLocalNotification(config);
      this.removeScheduledNotification(scheduledTimestamp);
    }, delay);
  }

  // Obter notificações agendadas
  getScheduledNotifications(): any[] {
    const stored = localStorage.getItem('scheduledNotifications');
    return stored ? JSON.parse(stored) : [];
  }

  // Remover notificação agendada
  removeScheduledNotification(scheduledTime: number): void {
    const scheduled = this.getScheduledNotifications();
    const filtered = scheduled.filter(n => n.scheduledTime !== scheduledTime);
    localStorage.setItem('scheduledNotifications', JSON.stringify(filtered));
  }

  // Reprocessar notificações agendadas ao abrir o app
  async reprocessScheduledNotifications(): Promise<void> {
    const scheduled = this.getScheduledNotifications();
    const now = Date.now();
    const toRemove: number[] = [];

    for (const notif of scheduled) {
      const delay = notif.scheduledTime - now;
      
      if (delay <= 0) {
        // Já passou, enviar agora
        await this.sendLocalNotification(notif);
        toRemove.push(notif.scheduledTime);
      } else if (delay <= 24 * 60 * 60 * 1000) {
        // Nas próximas 24h, reagendar
        setTimeout(() => {
          this.sendLocalNotification(notif);
          this.removeScheduledNotification(notif.scheduledTime);
        }, delay);
      }
    }

    // Remover notificações enviadas
    toRemove.forEach(time => this.removeScheduledNotification(time));
  }

  // Criar notificação de lembrete de tarefa
  async notifyTaskReminder(taskTitle: string, taskId: number, metaId?: number): Promise<void> {
    await this.sendLocalNotification({
      title: '📋 Lembrete de Tarefa',
      body: taskTitle,
      icon: '/logo.png',
      tag: `task-${taskId}`,
      requireInteraction: true,
      data: {
        type: 'task',
        taskId,
        metaId,
        url: metaId ? `/meta/${metaId}` : '/metas-diarias'
      }
    });
  }

  // Criar notificação de meta próxima do prazo
  async notifyGoalDeadline(goalTitle: string, goalId: number, daysLeft: number): Promise<void> {
    await this.sendLocalNotification({
      title: '🎯 Meta Próxima do Prazo',
      body: `"${goalTitle}" vence em ${daysLeft} ${daysLeft === 1 ? 'dia' : 'dias'}`,
      icon: '/logo.png',
      tag: `goal-${goalId}`,
      requireInteraction: true,
      data: {
        type: 'goal',
        goalId,
        url: `/meta/${goalId}`
      }
    });
  }

  // Criar notificação de parabéns por conclusão
  async notifyCelebration(message: string): Promise<void> {
    await this.sendLocalNotification({
      title: '🎉 Parabéns!',
      body: message,
      icon: '/logo.png',
      tag: 'celebration',
      requireInteraction: false,
      data: {
        type: 'celebration',
        url: '/metas-diarias'
      }
    });
  }

  // Cancelar todas as notificações
  async cancelAllNotifications(): Promise<void> {
    if (!this.registration) return;
    
    const notifications = await this.registration.getNotifications();
    notifications.forEach(notification => notification.close());
  }
}

export const notificationService = NotificationService.getInstance();

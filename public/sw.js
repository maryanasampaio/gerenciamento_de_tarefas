// Service Worker para notificações push
const CACHE_NAME = 'tarefas-v1';

// Instalar o service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Ativar o service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

// Receber notificações push
self.addEventListener('push', (event) => {
  console.log('Push recebido:', event);
  
  let data = {
    title: 'Lembrete de Tarefa',
    body: 'Você tem tarefas pendentes!',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'tarefa-lembrete',
    requireInteraction: true,
    data: {
      url: '/metas-diarias'
    }
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      data = { ...data, ...pushData };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag,
    requireInteraction: data.requireInteraction,
    data: data.data,
    actions: [
      { action: 'open', title: 'Abrir', icon: '/logo.png' },
      { action: 'close', title: 'Fechar', icon: '/logo.png' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Lidar com cliques nas notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/metas-diarias';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Verificar se já existe uma janela aberta
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        // Se não existe, abrir nova janela
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Sincronização em background (para agendar notificações)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event);
  
  if (event.tag === 'sync-tarefas') {
    event.waitUntil(verificarTarefasPendentes());
  }
});

async function verificarTarefasPendentes() {
  // Aqui você pode fazer fetch para verificar tarefas
  // e disparar notificações locais se necessário
  console.log('Verificando tarefas pendentes...');
}

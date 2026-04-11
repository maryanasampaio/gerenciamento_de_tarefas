# 🧭 TaskFlow — Frontend

**TaskFlow** é uma aplicação web completa para **gerenciamento de tarefas, metas e estudos**, com editor de pastas estilo Notion, sistema de notificações push, metas diárias/mensais/anuais e muito mais. Interface moderna construída em **React + Tailwind + ShadCN UI**.

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|--------------|
| **Framework principal** | [React 19](https://react.dev/) |
| **Empacotador** | [Vite 7](https://vitejs.dev/) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS 4](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/) |
| **Ícones** | [Lucide React](https://lucide.dev/) |
| **Formulários e UI base** | Radix UI + ShadCN Components |
| **Roteamento** | [React Router DOM 7](https://reactrouter.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Autenticação** | Context API (`AuthProvider`) + `RouteGuard` para rotas protegidas |
| **Confetti** | [react-confetti](https://www.npmjs.com/package/react-confetti) |
| **PWA / Service Worker** | `sw.js` na raiz pública |
| **Lint e Tipagem** | ESLint 9 + TypeScript 5.8 |

---

## 📂 Estrutura de Pastas

```
src/
├── assets/
├── components/
│   ├── BackgroundAnimations/   # Animações visuais da landing page
│   ├── Footer/
│   ├── Header/
│   ├── NotificationSettings/   # Configurações de notificações push
│   ├── RouteGuard/             # Proteção de rotas autenticadas/públicas
│   ├── Sidebar/                # Navegação lateral
│   ├── TaskAnimation/
│   └── ui/                     # Componentes base ShadCN (button, card, dialog, etc.)
├── context/
│   ├── AuthContext.tsx          # Autenticação global
│   ├── ModalContext.tsx         # Modais de feedback (sucesso, erro, loading)
│   ├── PastaContext.tsx         # Estado global das pastas (localStorage)
│   └── ToastContext.tsx
├── features/
│   ├── ajuda/                   # Página "Como Usar"
│   ├── auth/                    # Login (view, model, repository, usecase, viewmodel)
│   ├── landing/                 # Landing page pública
│   ├── metas/                   # Metas diárias, mensais e anuais
│   │   ├── components/          # Modais de criar/visualizar meta, timers de estudo
│   │   ├── models/
│   │   ├── repository/
│   │   ├── viewmodel/
│   │   └── views/               # MetasDiarias, MetasMensais, MetasAnuais, MetaDetalhes
│   ├── pastas/                  # Editor de pastas estilo Notion
│   │   ├── components/          # EditorRico, EditorResumo, VisualizadorResumos
│   │   ├── models/
│   │   └── views/               # PastaDetalhes
│   ├── tarefas/                 # Tarefas individuais
│   │   ├── components/
│   │   └── views/               # PaginaInicial, GerenciarTarefas
│   └── usuario/                 # Cadastro e configurações do usuário
├── hooks/
│   ├── useNotifications.ts      # Gerenciamento de notificações push
│   └── useTaskReminders.ts      # Lembretes automáticos de metas e tarefas
├── Layout/
│   └── LayoutApp.tsx
├── lib/
│   ├── recentItems.ts           # Histórico de itens recentes (localStorage)
│   └── utils.ts
├── services/
│   ├── api.ts                   # Instância Axios com base URL configurável
│   ├── notificationService.ts   # Notificações push do navegador
│   ├── soundService.ts          # Sons de feedback
│   └── weatherService.ts        # Integração com clima
├── App.tsx
└── main.tsx
```

---

## 🧩 Rotas da Aplicação

| Caminho | Componente | Protegida | Descrição |
|----------|-------------|-----------|------------|
| `/` | `LandingPage` | ❌ | Página pública de apresentação |
| `/home` | `LandingPage` | ❌ | Alias da landing page |
| `/login` | `LoginView` | ❌ | Login do usuário |
| `/cadastro` | `CadastroView` | ❌ | Cadastro de novo usuário |
| `/pagina-inicial` | `PaginaInicial` | ✅ | Dashboard com itens recentes e resumo |
| `/tarefas` | `GerenciarTarefas` | ✅ | Gerenciamento de tarefas individuais |
| `/metas-diarias` | `MetasDiarias` | ✅ | Metas do dia com filtros e busca |
| `/metas-mensais` | `MetasMensais` | ✅ | Metas do mês com navegação mensal |
| `/metas-anuais` | `MetasAnuais` | ✅ | Metas do ano com navegação anual |
| `/metas/:id` | `MetaDetalhes` | ✅ | Detalhes e tarefas de uma meta |
| `/pasta/:id` | `PastaDetalhes` | ✅ | Editor Notion-like da pasta |
| `/config-usuario` | `ConfigUsuarioView` | ✅ | Configurações do usuário |
| `/como-usar` | `ComoUsar` | ✅ | Guia de uso da aplicação |

O componente `RouteGuard` impede acesso a rotas privadas sem autenticação. `PublicRoute` redireciona usuários autenticados para fora do login/cadastro.

---

## ✨ Funcionalidades Implementadas

### 📋 Tarefas
- Criação, edição e exclusão de tarefas individuais
- Filtros por status (pendente, andamento, concluída) e importância (alta, média, baixa)
- Busca por texto
- Data de vencimento e tags

### 🎯 Metas
- Metas **diárias**, **mensais** e **anuais** com contextos (estudos, exercícios, trabalho, finanças, saúde, lazer, outros)
- Filtros client-side por status e importância
- Barra de progresso baseada nas tarefas internas da meta
- **Alternância de conclusão** com persistência via backend
- Status override local (metas sem tarefas)
- Confete de celebração ao concluir todas as metas do dia
- Lembretes automáticos e verificação periódica de prazos

### 📁 Pastas — Editor Notion-like
- Editor de blocos com 7 tipos: **Texto, Título, Lista, Checklist, Código, Citação, Resumo**
- Enter cria nova linha no mesmo bloco; **Shift+Enter / Ctrl+Enter** cria novo bloco
- Listas e checklists: Enter cria novo item automaticamente
- Comando `/` (slash) para selecionar tipo de bloco inline
- Botão `+` lateral para inserir blocos
- Backspace no início de bloco junta com o bloco anterior, posicionando o cursor corretamente
- Ctrl+A seleciona todo o conteúdo; segundo Ctrl+A seleciona todos os blocos
- Ctrl+A + Delete apaga todos os blocos de uma vez
- Botão Excluir condicional (só aparece quando o bloco tem conteúdo)
- Texto sempre quebra dentro do card (`break-words`)
- **Modo Visualização / Modo Edição** para resumos: ao abrir um resumo salvo, inicia em somente leitura; edição ativada pelo botão "Editar"
- Resumos com editor rico: negrito, itálico, títulos (H1/H2/H3), marca-texto colorido

### 🔔 Notificações Push
- Suporte a notificações do navegador (PWA-ready com `sw.js`)
- Configurações por tipo: lembretes de tarefas, prazos de metas, celebrações
- Horário e antecedência de lembrete configuráveis
- Sons de feedback

### 🌦️ Clima
- Integração com serviço de clima (`weatherService`)

### 🕒 Histórico de Itens Recentes
- Dashboard com atalhos rápidos para metas e tarefas acessadas recentemente

### ⚡ Performance
- `ModalContext` estabilizado com `useRef` + `useMemo` (sem re-renders desnecessários)
- `carregarMetas` com `useCallback` sem dependência de modal
- Proteção contra chamadas duplicadas via `useRef` de controle em todas as views de metas
- Keys estáveis nos cards de metas (sem incluir `status` na key)

---

## ⚙️ Scripts Disponíveis

| Comando | Ação |
|----------|-------|
| `npm run dev` | Inicia o servidor de desenvolvimento com Vite |
| `npm run build` | Gera o build otimizado de produção |
| `npm run preview` | Executa o build localmente para pré-visualização |
| `npm run lint` | Analisa o código com ESLint |

---

## 📦 Dependências Principais

```json
"react": "^19.1.1",
"react-router-dom": "^7.9.3",
"tailwindcss": "^4.1.13",
"axios": "^1.12.2",
"lucide-react": "^0.544.0",
"react-confetti": "^6.1.0"
```

---

## 🧰 Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/maryanasampaio/gerenciamento_de_tarefas.git
cd gerenciamento_de_tarefas
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variável de ambiente

Crie/edite o arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://gerenciamentodetarefas-backend-production-faa3.up.railway.app/api
```

⚠️ Sempre reinicie o servidor após alterar o `.env`.

### 4. Executar em modo de desenvolvimento

```bash
npm run dev
```

Rodará em: http://localhost:5173


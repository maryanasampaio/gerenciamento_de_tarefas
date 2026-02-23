# 🧭 TaskFlow — Frontend

**TaskFlow** é uma aplicação web para **gerenciamento de tarefas**, permitindo criar, editar e excluir tarefas de forma simples e intuitiva.  
Além disso, conta com **sistema de autenticação**, **cadastro de usuário**, e **configurações personalizadas**, tudo com uma interface moderna construída em **React + Tailwind + ShadCN UI**.

---

## 🚀 Tecnologias Utilizadas

O frontend foi desenvolvido com as seguintes tecnologias e bibliotecas principais:

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
| **Lint e Tipagem** | ESLint 9 + TypeScript 5.8 |

---

## 📂 Estrutura de Pastas

A estrutura geral do projeto segue uma arquitetura modular por **features**:


src/
├── components/
│ ├── RouteGuard/
│ └── ...
├── context/
│ └── AuthContext.tsx
├── features/
│ ├── auth/
│ │ └── views/LoginView.tsx
│ ├── tarefas/
│ │ └── views/PaginaInicial.tsx
│ └── usuario/
│ ├── views/CadastroView.tsx
│ └── views/ConfigUsuarioView.tsx
├── Layout/
│ └── LayoutApp.tsx
├── App.tsx
└── main.tsx


---

## 🧩 Rotas da Aplicação

O sistema de rotas utiliza `react-router-dom` e inclui proteção de rotas para áreas autenticadas.

| Caminho | Componente | Protegida | Descrição |
|----------|-------------|-----------|------------|
| `/` | `LoginView` | ❌ | Página inicial de login |
| `/login` | `LoginView` | ❌ | Alternativa de rota para login |
| `/cadastro` | `CadastroView` | ❌ | Cadastro de novo usuário |
| `/pagina-inicial` | `PaginaInicial` | ✅ | Área principal de tarefas |
| `/config-usuario` | `ConfigUsuarioView` | ✅ | Configurações do usuário logado |

O componente `RouteGuard` impede o acesso a rotas privadas sem autenticação, utilizando o contexto `AuthProvider`.

---

## ⚙️ Scripts Disponíveis

No diretório do projeto, você pode executar:

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
"@shadcn/ui": "^0.0.4",
"axios": "^1.12.2",
"lucide-react": "^0.544.0"
```


## 🧰 Configuração do Ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/maryanasampaio/gerenciamento_de_tarefas.git
cd gerenciamento_de_tarefas-frontend
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
Rodará em: 
http://localhost:5173


# 📋 TurmaBoard — Frontend

> **Hackathon Pós-Tech — "Inovação no auxílio aos professores do ensino público"**

Frontend React + TypeScript para o sistema **TurmaBoard** — quadros estilo Kanban para gestão de tarefas docentes e interação com alunos (Dúvidas/Respostas).

---

## 🛠️ Stack

| Tecnologia | Descrição |
|---|---|
| **React 19** | Biblioteca de UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Bundler / dev server |
| **MUI (Material UI) v6** | Componentes visuais |
| **React Router DOM v7** | Roteamento SPA |
| **Axios** | Requisições HTTP |
| **@dnd-kit** | Drag-and-drop no Kanban |
| **notistack** | Notificações (snackbar/toast) |
| **React Context** | Gerenciamento de estado |

---

## 🚀 Como rodar

### Pré-requisitos

- **Node.js** 18+ e **npm** instalados.
- **API TurmaBoard** rodando (ver [repositório da API](https://github.com/IcaroBossi/pos-tech-challenge-fase-5-api))

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/IcaroBossi/pos-tech-challenge-fase-5-frontend.git
cd pos-tech-challenge-fase-5-frontend

# 2. Instale as dependências
npm install

# 3. Configure a variável de ambiente (opcional — padrão é http://localhost:3000)
cp .env.example .env
# Edite o .env se a API estiver em outra porta/host

# 4. Inicie o dev server
npm run dev
```

O frontend será acessível em **http://localhost:5173**.

### Build de produção

```bash
npm run build
npm run preview
```

---

## 🔑 Autenticação Demo

O sistema NÃO possui autenticação real. Utiliza um "login demo" com header:

| Perfil | Header enviado |
|---|---|
| **Professor** | `x-demo-user: teacher` |
| **Aluno** | `x-demo-user: student` |

Ao abrir o app, a primeira tela permite **escolher o perfil** (Professor ou Aluno). O valor é salvo em `localStorage` e injetado automaticamente em todas as requisições via interceptor Axios.

---

## 🗺️ Rotas do Frontend

| Rota | Perfil | Descrição |
|---|---|---|
| `/` | — | Tela de escolha de perfil (demo login) |
| `/teacher` | Professor | Dashboard do professor |
| `/teacher/tasks` | Professor | Board Kanban de tarefas |
| `/teacher/classes` | Professor | Lista de turmas do professor |
| `/teacher/classes/:classId/questions` | Professor | Dúvidas de uma turma |
| `/teacher/classes/:classId/questions/:questionId` | Professor | Detalhe da dúvida + respostas |
| `/student` | Aluno | Dashboard do aluno |
| `/student/classes` | Aluno | Turmas do aluno |
| `/student/classes/:classId/questions` | Aluno | Dúvidas de uma turma |
| `/student/classes/:classId/questions/:questionId` | Aluno | Detalhe da dúvida + respostas |

---

## 🧪 Como testar

### Como Professor

1. Na tela inicial, clique em **"Entrar como Professor"**.
2. No **Dashboard**, veja resumo de tarefas e atalhos.
3. Acesse **"Minhas Tarefas"** para ver o quadro Kanban:
   - Crie tarefas (com ou sem turma vinculada)
   - Arraste tarefas entre colunas (TODO → DOING → DONE)
   - Edite ou exclua tarefas
   - Filtre por turma ou status
4. Acesse **"Minhas Turmas"**:
   - Crie turmas e copie o código de acesso (joinCode)
   - Clique numa turma para ver as dúvidas dos alunos
   - Responda dúvidas dos alunos

### Como Aluno

1. Na tela inicial, clique em **"Entrar como Aluno"**.
2. Acesse **"Minhas Turmas"**:
   - Entre em uma turma usando um código (ex: `TURMA1`, `TURMA2`)
   - Clique numa turma para ver as dúvidas
3. **Crie dúvidas** numa turma.
4. Veja respostas do professor e **marque como resolvida** quando satisfeito.

---

## 📁 Estrutura do Projeto

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Providers (Theme, Snackbar, Auth, Router)
├── theme.ts                          # Tema MUI customizado
├── vite-env.d.ts                     # Tipos das env vars
├── api/
│   ├── axios.ts                      # Instância Axios + interceptors
│   ├── classes.api.ts                # Endpoints de turmas
│   ├── tasks.api.ts                  # Endpoints de tarefas
│   └── questions.api.ts             # Endpoints de dúvidas e respostas
├── types/
│   ├── index.ts                      # Re-exports
│   ├── user.ts                       # User, DemoProfile
│   ├── class.ts                      # ClassEntity
│   ├── task.ts                       # Task, TaskStatus, payloads
│   ├── question.ts                   # Question, QuestionStatus
│   └── reply.ts                      # Reply, CreateReplyPayload
├── store/
│   └── AuthContext.tsx               # Context de autenticação demo
├── routes/
│   ├── index.tsx                     # Definição de rotas (createBrowserRouter)
│   └── ProtectedRoute.tsx            # Guarda de rotas por perfil
├── components/
│   ├── Layout/
│   │   ├── AppLayout.tsx             # Layout principal (Topbar + Sidebar + Outlet)
│   │   ├── Topbar.tsx                # Barra superior
│   │   └── Sidebar.tsx               # Menu lateral responsivo
│   ├── Kanban/
│   │   ├── KanbanBoard.tsx           # Board com 3 colunas + DnD
│   │   ├── KanbanColumn.tsx          # Coluna droppable
│   │   └── TaskCard.tsx              # Card de tarefa draggable
│   ├── Modals/
│   │   ├── ConfirmDialog.tsx         # Diálogo de confirmação
│   │   ├── CreateTaskModal.tsx       # Modal criar tarefa
│   │   ├── EditTaskModal.tsx         # Modal editar tarefa
│   │   ├── CreateClassModal.tsx      # Modal criar turma
│   │   ├── JoinClassModal.tsx        # Modal entrar em turma
│   │   └── CreateQuestionModal.tsx   # Modal criar dúvida
│   ├── Loading/
│   │   └── LoadingSpinner.tsx        # Spinner de carregamento
│   └── EmptyState/
│       └── EmptyState.tsx            # Estado vazio
└── pages/
    ├── ChooseProfile.tsx             # Tela de seleção de perfil
    ├── teacher/
    │   ├── TeacherDashboard.tsx       # Dashboard professor
    │   ├── TeacherTasks.tsx           # Kanban de tarefas
    │   ├── TeacherClasses.tsx         # Lista de turmas
    │   ├── TeacherClassQuestions.tsx   # Dúvidas de uma turma
    │   └── QuestionDetail.tsx         # Detalhe + responder
    └── student/
        ├── StudentDashboard.tsx       # Dashboard aluno
        ├── StudentClasses.tsx         # Turmas + entrar por código
        ├── StudentClassQuestions.tsx   # Dúvidas + criar
        └── QuestionDetail.tsx         # Detalhe + resolver
```

---

## 📄 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `VITE_API_URL` | URL base da API TurmaBoard | `http://localhost:3000` |

---

## 📄 Licença

MIT
Frontend desenvolvido para o tech challenge da fase 5 da Pós-Tech FIAP.

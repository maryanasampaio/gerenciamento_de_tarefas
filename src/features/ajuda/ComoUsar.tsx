import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useState } from "react";
import {
  Target,
  CheckCircle2,
  Calendar,
  ListTodo,
  TrendingUp,
  BookOpen
} from "lucide-react";

export const ComoUsar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const passos = [
    {
      numero: 1,
      titulo: "Defina suas Metas",
      descricao: "Acesse Metas Diárias, Mensais ou Anuais e clique em 'Nova Meta' para definir seus objetivos principais.",
      icone: Target,
      cor: "from-blue-500 to-cyan-600"
    },
    {
      numero: 2,
      titulo: "Crie Tarefas para cada Meta",
      descricao: "Clique em uma meta para abrir seus detalhes. Dentro dela, defina as tarefas específicas que te levarão até seu objetivo.",
      icone: ListTodo,
      cor: "from-cyan-500 to-teal-600"
    },
    {
      numero: 3,
      titulo: "Acompanhe seu Progresso",
      descricao: "Marque as tarefas como concluídas conforme avança. O dashboard mostra seu progresso em tempo real.",
      icone: CheckCircle2,
      cor: "from-emerald-500 to-green-600"
    },
    {
      numero: 4,
      titulo: "Use o Calendário",
      descricao: "No dashboard, clique em qualquer dia do calendário para ver as metas e tarefas daquela data específica.",
      icone: Calendar,
      cor: "from-indigo-500 to-purple-600"
    },
    {
      numero: 5,
      titulo: "Revise Períodos Anteriores",
      descricao: "Em Metas Mensais e Anuais, use as setas ← → para navegar entre períodos e revisar suas conquistas passadas.",
      icone: TrendingUp,
      cor: "from-violet-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } p-3 sm:p-4 md:p-6 lg:p-8 relative z-10`}
      >
        {/* Botão para abrir sidebar no mobile */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mb-3 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all inline-flex items-center gap-2"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">Menu</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Como Usar
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Aprenda a gerenciar suas metas e tarefas de forma eficiente
          </p>
        </div>

        {/* Conceito Principal */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 backdrop-blur-sm border-l-4 border-l-blue-500">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            💡 Conceito Principal
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            <strong>Metas</strong> são seus objetivos principais - o que você quer conquistar.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Tarefas</strong> são as ações específicas que você precisa realizar para alcançar cada meta.
          </p>
        </Card>

        {/* Passos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Passo a Passo
          </h2>
          
          {passos.map((passo) => {
            const Icon = passo.icone;
            return (
              <Card 
                key={passo.numero}
                className="p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${passo.cor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                        PASSO {passo.numero}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {passo.titulo}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {passo.descricao}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Dicas */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 backdrop-blur-sm border-l-4 border-l-amber-500">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            ✨ Dicas de Produtividade
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>Priorize suas tarefas usando os níveis de importância: Alta, Média e Baixa</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>Revise suas metas diariamente no Dashboard para manter o foco</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>Divida metas grandes em tarefas menores e mais gerenciáveis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>Use o calendário para planejar suas metas com antecedência</span>
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

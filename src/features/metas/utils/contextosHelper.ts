import {
  BookOpen,
  Dumbbell,
  Briefcase,
  DollarSign,
  Heart,
  Smile,
  Target
} from "lucide-react";
import { ContextoMeta } from "../models/MetaModel";

export interface ContextoConfig {
  icon: any;
  label: string;
  color: string;
  gradient: string;
  bgLight: string;
  borderLight: string;
  textColor: string;
}

export const contextosConfig: Record<ContextoMeta, ContextoConfig> = {
  estudos: {
    icon: BookOpen,
    label: 'Estudos',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    borderLight: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  exercicios: {
    icon: Dumbbell,
    label: 'Exercícios',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50 dark:bg-orange-950/20',
    borderLight: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  trabalho: {
    icon: Briefcase,
    label: 'Trabalho',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    borderLight: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  financas: {
    icon: DollarSign,
    label: 'Finanças',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    borderLight: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-600 dark:text-green-400'
  },
  saude: {
    icon: Heart,
    label: 'Saúde',
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    borderLight: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400'
  },
  lazer: {
    icon: Smile,
    label: 'Lazer',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    borderLight: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-600 dark:text-pink-400'
  },
  outros: {
    icon: Target,
    label: 'Outros',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  }
};

// Fallback simples para contextos não mapeados
const fallbackConfig: ContextoConfig = {
  icon: Target,
  label: 'Meta',
  color: 'gray',
  gradient: 'from-gray-500 to-slate-600',
  bgLight: 'bg-gray-50 dark:bg-gray-950/20',
  borderLight: 'border-gray-200 dark:border-gray-800',
  textColor: 'text-gray-600 dark:text-gray-400'
};

export const getContextoConfig = (contexto: ContextoMeta): ContextoConfig => {
  return contextosConfig[contexto] || fallbackConfig;
};

// Sugestões específicas por contexto
export const sugestoesPorContexto: Record<ContextoMeta, string[]> = {
  estudos: [
    '📚 Revise conceitos anteriores antes de avançar',
    '✍️ Faça anotações à mão para melhor retenção',
    '🎯 Ensine o conteúdo para alguém (técnica Feynman)',
    '🔄 Use repetição espaçada para memorização',
    '🧠 Alterne entre diferentes tipos de conteúdo',
    '☕ Faça pausas regulares (técnica Pomodoro)'
  ],
  exercicios: [
    '🏃 Comece com aquecimento de 5-10 minutos',
    '💧 Mantenha-se hidratado durante o treino',
    '📊 Registre seu progresso e evolução',
    '🎯 Defina metas realistas e graduais',
    '🧘 Não esqueça do alongamento pós-treino',
    '😴 Respeite o descanso entre treinos'
  ],
  trabalho: [
    '📋 Priorize tarefas pela matriz de Eisenhower',
    '⏰ Use timeboxing para tarefas complexas',
    '🔕 Elimine distrações durante trabalho focado',
    '📝 Faça listas de verificação para processos',
    '☕ Faça pausas estratégicas a cada 90 minutos',
    '🤝 Comunique progresso regularmente com a equipe'
  ],
  financas: [
    '💰 Registre todas as despesas diariamente',
    '📊 Revise seu orçamento mensalmente',
    '🎯 Estabeleça metas financeiras claras',
    '💳 Priorize eliminar dívidas de juros altos',
    '📈 Reserve uma porcentagem para investimentos',
    '🔍 Compare preços antes de grandes compras'
  ],
  saude: [
    '💊 Tome medicamentos nos horários corretos',
    '🥗 Mantenha uma alimentação balanceada',
    '💧 Beba pelo menos 2 litros de água por dia',
    '😴 Durma 7-8 horas por noite',
    '🧘 Pratique mindfulness ou meditação',
    '🏥 Mantenha consultas médicas em dia'
  ],
  lazer: [
    '🎮 Reserve tempo específico para hobbies',
    '👥 Socialize com amigos e família',
    '🌳 Passe tempo ao ar livre',
    '📚 Leia por prazer, não apenas por estudo',
    '🎨 Experimente novas atividades criativas',
    '🧘 Desconecte-se de telas regularmente'
  ],
  outros: [
    '🎯 Defina objetivos claros e mensuráveis',
    '📝 Divida grandes metas em etapas menores',
    '⏰ Estabeleça prazos realistas',
    '📊 Acompanhe seu progresso regularmente',
    '🔄 Ajuste sua estratégia conforme necessário',
    '🎉 Celebre pequenas conquistas no caminho'
  ]
};

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
    label: '📚 Estudos',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    borderLight: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  exercicios: {
    icon: Dumbbell,
    label: '🏋️‍♀️ Exercícios',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50 dark:bg-orange-950/20',
    borderLight: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  trabalho: {
    icon: Briefcase,
    label: '💼 Trabalho',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    borderLight: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  financas: {
    icon: DollarSign,
    label: '💰 Finanças',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    borderLight: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-600 dark:text-green-400'
  },
  saude: {
    icon: Heart,
    label: '🏥 Saúde',
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    borderLight: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400'
  },
  lazer: {
    icon: Smile,
    label: '🎮 Lazer / Entretenimento',
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
  },
  // Categorias expandidas
  treino: {
    icon: Dumbbell,
    label: '🏋️‍♀️ Treino / Atividade física',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50 dark:bg-orange-950/20',
    borderLight: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  alimentacao: {
    icon: Heart,
    label: '🥗 Alimentação / Refeições',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    borderLight: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-600 dark:text-green-400'
  },
  compras: {
    icon: DollarSign,
    label: '🛒 Compras (supermercado, feira, farmácia)',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600',
    bgLight: 'bg-green-50 dark:bg-green-950/20',
    borderLight: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-600 dark:text-green-400'
  },
  projetos_pessoais: {
    icon: Briefcase,
    label: '💻 Projetos pessoais',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    borderLight: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  casa: {
    icon: Target,
    label: '🏠 Casa (limpeza, organização, manutenção)',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  familia: {
    icon: Smile,
    label: '👨‍👩‍👧 Família',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    borderLight: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-600 dark:text-pink-400'
  },
  relacionamento: {
    icon: Heart,
    label: '❤️ Relacionamento',
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    borderLight: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400'
  },
  saude_mental: {
    icon: Heart,
    label: '🧠 Saúde mental / Autocuidado',
    color: 'red',
    gradient: 'from-red-500 to-pink-600',
    bgLight: 'bg-red-50 dark:bg-red-950/20',
    borderLight: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-600 dark:text-red-400'
  },
  pets: {
    icon: Smile,
    label: '🐶 Pets',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    borderLight: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-600 dark:text-pink-400'
  },
  transporte: {
    icon: Target,
    label: '🚗 Transporte / Deslocamento',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  ligacoes: {
    icon: Briefcase,
    label: '📞 Ligações / Contatos importantes',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    borderLight: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  compromissos: {
    icon: Briefcase,
    label: '📅 Compromissos / Reuniões',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/20',
    borderLight: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  metas_pessoais: {
    icon: Target,
    label: '🎯 Metas pessoais',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  leitura: {
    icon: BookOpen,
    label: '📖 Leitura',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/20',
    borderLight: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  espiritualidade: {
    icon: Target,
    label: '🙏 Espiritualidade',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  viagens: {
    icon: Smile,
    label: '✈️ Viagens',
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    bgLight: 'bg-pink-50 dark:bg-pink-950/20',
    borderLight: 'border-pink-200 dark:border-pink-800',
    textColor: 'text-pink-600 dark:text-pink-400'
  },
  documentacao: {
    icon: Target,
    label: '🧾 Documentação / Burocracias',
    color: 'gray',
    gradient: 'from-gray-500 to-slate-600',
    bgLight: 'bg-gray-50 dark:bg-gray-950/20',
    borderLight: 'border-gray-200 dark:border-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400'
  },
  manutencao: {
    icon: Target,
    label: '🛠️ Manutenção (carro, casa, equipamentos)',
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
  ],
  treino: [
    '🏃 Inclua aquecimento e desaquecimento em todos os treinos',
    '🏋️‍♀️ Combine exercícios compostos e isolados',
    '💧 Beba água antes, durante e depois da atividade',
    '📅 Planeje treinos diferentes ao longo da semana',
    '😴 Respeite o descanso muscular entre sessões'
  ],
  alimentacao: [
    '🥗 Priorize alimentos naturais e pouco processados',
    '🍽️ Planeje as refeições da semana com antecedência',
    '💧 Beba água entre as refeições',
    '📝 Anote o que comeu para ganhar consciência alimentar'
  ],
  compras: [
    '🧾 Faça uma lista antes de sair de casa',
    '💰 Defina um orçamento máximo para a compra',
    '📅 Prefira dias e horários com menos movimento',
    '🔍 Confira validade e preços com atenção'
  ],
  projetos_pessoais: [
    '🧩 Quebre o projeto em entregas menores',
    '📆 Reserve blocos fixos na semana para avançar',
    '✅ Defina o que é "feito" para cada etapa',
    '📊 Revise o progresso ao fim de cada semana'
  ],
  casa: [
    '🧹 Separe um dia da semana para limpeza geral',
    '📦 Desapegue de itens que não usa há muito tempo',
    '🧺 Organize por cômodo para não se perder nas tarefas',
    '🛠️ Anote pequenas manutenções para não esquecer'
  ],
  familia: [
    '👨‍👩‍👧 Reserve momentos de qualidade sem telas',
    '📅 Combine antecipadamente dias de compromissos em família',
    '💬 Mantenha conversas abertas sobre rotina e necessidades'
  ],
  relacionamento: [
    '❤️ Marque momentos intencionais a dois na agenda',
    '💬 Pratique comunicação clara e empática',
    '🎁 Surpreenda com pequenos gestos no dia a dia'
  ],
  saude_mental: [
    '🧠 Separe alguns minutos diários para respirar com calma',
    '📓 Escreva pensamentos e preocupações em um diário',
    '🚶 Faça pequenas caminhadas ao ar livre quando possível',
    '📵 Desconecte-se de redes sociais em momentos de descanso'
  ],
  pets: [
    '🐶 Agende consultas e vacinas com antecedência',
    '🚶 Reserve tempo diário para passeios e brincadeiras',
    '🍖 Mantenha a alimentação do pet organizada e regular'
  ],
  transporte: [
    '⏰ Saia com antecedência para evitar imprevistos',
    '🗺️ Planeje a rota antes de sair de casa',
    '🧾 Organize documentos do veículo em um único lugar'
  ],
  ligacoes: [
    '📞 Anote os pontos principais antes de ligar',
    '✅ Liste as pessoas que precisa contatar na semana',
    '🕒 Escolha horários adequados para cada tipo de ligação'
  ],
  compromissos: [
    '📅 Confirme horário e local com antecedência',
    '⏰ Programe lembretes antes do compromisso começar',
    '📝 Leve anotações ou documentos importantes necessários'
  ],
  metas_pessoais: [
    '🎯 Defina metas específicas, mensuráveis e com prazo',
    '📆 Revise suas metas mensalmente',
    '🏆 Celebre cada pequena vitória ao longo do caminho'
  ],
  leitura: [
    '📖 Separe um horário fixo do dia para ler',
    '🔖 Use marcadores ou anotações para registrar ideias',
    '📚 Intercale leituras leves com conteúdos mais densos'
  ],
  espiritualidade: [
    '🙏 Reserve momentos silenciosos para reflexão ou oração',
    '📿 Crie pequenos rituais que façam sentido para você',
    '📖 Leia textos que fortaleçam seus valores e fé'
  ],
  viagens: [
    '✈️ Planeje roteiro e hospedagem com antecedência',
    '🧳 Faça uma checklist de itens essenciais',
    '💰 Defina um orçamento diário para a viagem'
  ],
  documentacao: [
    '🧾 Separe um local específico para guardar documentos',
    '📅 Anote datas de vencimento de documentos importantes',
    '📝 Digitalize comprovantes e contratos sempre que possível'
  ],
  manutencao: [
    '🛠️ Anote ruídos ou problemas que perceber no dia a dia',
    '📆 Programe revisões preventivas para carro e equipamentos',
    '🔧 Separe um pequeno fundo mensal para manutenções'
  ]
};

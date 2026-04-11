// Sistema inteligente de detecção de contexto e sugestões

export interface ContextualWidget {
  type: 'weather' | 'study' | 'finance' | 'health' | 'reminder' | 'shopping' | 'movies' | 'books' | 'cardio' | 'workout';
  title: string;
  data: any;
  icon: string;
}

// Palavras-chave para cada tipo de contexto
const keywords = {
  weather: ['correr', 'corrida', 'caminhar', 'caminhada', 'pedalar', 'ciclismo', 'nadar', 'natação', 'treino ao ar livre', 'parque', 'jogging'],
  study: ['estudar', 'aprender', 'curso', 'prova', 'exame', 'vestibular', 'concurso', 'faculdade', 'universidade'],
  finance: ['investir', 'investimento', 'poupar', 'economia', 'comprar ações', 'bolsa', 'bitcoin', 'cripto', 'dólar', 'euro'],
  health: ['academia', 'ginástica', 'musculação', 'yoga', 'pilates', 'dieta', 'emagrecer', 'peso', 'calorias', 'saúde'],
  shopping: ['compras', 'mercado', 'supermercado', 'feira', 'farmácia', 'remédio', 'açougue', 'padaria', 'shopping', 'loja', 'mercadinho'],
  reminder: ['pagar', 'conta', 'boleto', 'médico', 'dentista', 'aniversário', 'reunião', 'entrevista'],
  movies: ['assistir', 'filme', 'filmes', 'cinema', 'série', 'séries', 'netflix', 'tv', 'televisão', 'streaming'],
  books: ['ler', 'leitura', 'livro', 'livros', 'romance', 'biografia', 'literatura', 'biblioteca'],
  cardio: ['cardio', 'correr', 'corrida', 'caminhar', 'caminhada', 'cooper', 'jogging', 'treino aeróbico', 'aeróbico'],
  workout: ['treinar', 'treino', 'musculação', 'hipertrofia', 'força', 'academia', 'malhar', 'pesos', 'exercício', 'workout']
};

// Dados mockados
const mockData = {
  weather: {
    temperatura: null,
    condicao: '',
    umidade: null,
    vento: '',
    recomendacao: ''
  },
  study: {
    tecnica: 'Técnica Pomodoro',
    descricao: '25 minutos de foco intenso + 5 minutos de pausa',
    melhorHorario: 'Melhor horário: manhã (6h-10h)'
  },
  finance: {
    dolar: 'R$ 5,85',
    bitcoin: 'R$ 235.450',
    ibovespa: '+0.8%',
    dica: 'Diversifique seus investimentos para reduzir riscos.'
  },
  health: {
    agua: '2L/dia',
    calorias: '2000 kcal',
    passos: '10.000/dia'
  },
  shopping: {
    categorias: [
      { nome: '🍎 Frutas e Verduras', itens: ['Banana', 'Maçã', 'Alface', 'Tomate', 'Cenoura'] },
      { nome: '🥩 Proteínas', itens: ['Frango', 'Carne', 'Ovos', 'Feijão'] },
      { nome: '🥛 Laticínios', itens: ['Leite', 'Queijo', 'Iogurte', 'Manteiga'] },
      { nome: '🧹 Limpeza', itens: ['Detergente', 'Sabão', 'Álcool', 'Amaciante'] }
    ],
    melhorHorario: 'Terça/Quarta pela manhã (menos movimento)',
    dicas: [
      'Vá ao mercado após comer (evita compras por impulso)',
      'Compare preços em diferentes seções',
      'Leve sacolas retornáveis',
      'Confira validade dos produtos'
    ]
  },
  reminder: {
    mensagem: 'Não esqueça de verificar prazos e datas importantes!'
  },
  movies: {
    topFilmes: [
      { 
        titulo: 'Oppenheimer', 
        genero: 'Drama/História', 
        nota: '8.9/10', 
        diretor: 'Christopher Nolan',
        imagem: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop'
      },
      { 
        titulo: 'Duna: Parte Dois', 
        genero: 'Ficção Científica', 
        nota: '8.7/10', 
        diretor: 'Denis Villeneuve',
        imagem: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop'
      },
      { 
        titulo: 'Pobres Criaturas', 
        genero: 'Comédia Dramática', 
        nota: '8.4/10', 
        diretor: 'Yorgos Lanthimos',
        imagem: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop'
      }
    ],
    dica: 'Assista com atenção aos detalhes da direção e fotografia!'
  },
  books: {
    topLivros: [
      { 
        titulo: 'A Paciente Silenciosa', 
        autor: 'Alex Michaelides', 
        genero: 'Suspense/Thriller', 
        nota: '4.5/5',
        imagem: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop'
      },
      { 
        titulo: 'É Assim Que Acaba', 
        autor: 'Colleen Hoover', 
        genero: 'Romance Contemporâneo', 
        nota: '4.6/5',
        imagem: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop'
      },
      { 
        titulo: 'Sapiens', 
        autor: 'Yuval Noah Harari', 
        genero: 'Não-ficção/História', 
        nota: '4.7/5',
        imagem: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=200&h=300&fit=crop'
      }
    ],
    dica: 'Reserve 30 minutos diários para criar o hábito de leitura!'
  },
  cardio: {
    treinos: {
      // Iniciante
      iniciante: {
        '18-30': {
          tipo: 'Caminhada Intervalada',
          duracao: '25-30 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Caminhada leve', fc: '50-60% FC máx' },
            { fase: 'Treino', tempo: '15 min', intensidade: 'Alterne: 2 min rápido + 2 min lento', fc: '60-70% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada leve', fc: '50-60% FC máx' }
          ],
          frequencia: '3-4x por semana',
          dica: 'Mantenha uma postura ereta e respire pelo nariz'
        },
        '31-50': {
          tipo: 'Caminhada Progressiva',
          duracao: '20-25 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Caminhada muito leve', fc: '50-55% FC máx' },
            { fase: 'Treino', tempo: '12 min', intensidade: 'Caminhada moderada', fc: '60-65% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada leve', fc: '50-55% FC máx' }
          ],
          frequencia: '3x por semana',
          dica: 'Use tênis adequado e hidrate-se bem'
        },
        '51+': {
          tipo: 'Caminhada Suave',
          duracao: '20 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Caminhada muito leve', fc: '45-50% FC máx' },
            { fase: 'Treino', tempo: '10 min', intensidade: 'Caminhada confortável', fc: '55-60% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada muito leve', fc: '45-50% FC máx' }
          ],
          frequencia: '3x por semana',
          dica: 'Priorize regularidade e conforto, não velocidade'
        }
      },
      // Intermediário
      intermediario: {
        '18-30': {
          tipo: 'Corrida Intervalada',
          duracao: '35-40 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Trote leve', fc: '60-65% FC máx' },
            { fase: 'Treino', tempo: '25 min', intensidade: 'Alterne: 3 min corrida + 2 min caminhada', fc: '70-80% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada', fc: '50-60% FC máx' }
          ],
          frequencia: '4-5x por semana',
          dica: 'Mantenha ritmo constante nas corridas, recupere bem nas caminhadas'
        },
        '31-50': {
          tipo: 'Trote Contínuo',
          duracao: '30-35 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Caminhada rápida', fc: '60-65% FC máx' },
            { fase: 'Treino', tempo: '20 min', intensidade: 'Trote moderado contínuo', fc: '70-75% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada', fc: '55-60% FC máx' }
          ],
          frequencia: '3-4x por semana',
          dica: 'Foque na respiração ritmada: 3 passos inspira, 3 passos expira'
        },
        '51+': {
          tipo: 'Caminhada Intervalada Avançada',
          duracao: '30 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Caminhada leve', fc: '55-60% FC máx' },
            { fase: 'Treino', tempo: '20 min', intensidade: 'Alterne: 3 min rápido + 2 min moderado', fc: '65-70% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada leve', fc: '50-55% FC máx' }
          ],
          frequencia: '4x por semana',
          dica: 'Aumente gradualmente a intensidade, não o tempo'
        }
      },
      // Avançado
      avancado: {
        '18-30': {
          tipo: 'Treino de Velocidade (Fartlek)',
          duracao: '45-50 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '10 min', intensidade: 'Trote leve progressivo', fc: '60-70% FC máx' },
            { fase: 'Treino', tempo: '30 min', intensidade: 'Alterne: 1 min sprint + 2 min recuperação ativa', fc: '80-90% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Trote leve + caminhada', fc: '50-60% FC máx' }
          ],
          frequencia: '5-6x por semana',
          dica: 'Sprints em máxima intensidade, recuperação em trote muito leve'
        },
        '31-50': {
          tipo: 'Corrida de Resistência',
          duracao: '40-45 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Trote leve', fc: '60-65% FC máx' },
            { fase: 'Treino', tempo: '30 min', intensidade: 'Corrida ritmo constante moderado/forte', fc: '75-85% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Trote leve + alongamento', fc: '55-60% FC máx' }
          ],
          frequencia: '4-5x por semana',
          dica: 'Mantenha o ritmo consistente, monitore frequência cardíaca'
        },
        '51+': {
          tipo: 'Trote Intervalado Longo',
          duracao: '35-40 minutos',
          fases: [
            { fase: 'Aquecimento', tempo: '5 min', intensidade: 'Caminhada rápida', fc: '60-65% FC máx' },
            { fase: 'Treino', tempo: '25 min', intensidade: 'Alterne: 4 min trote + 2 min caminhada', fc: '70-80% FC máx' },
            { fase: 'Desaquecimento', tempo: '5 min', intensidade: 'Caminhada leve', fc: '50-55% FC máx' }
          ],
          frequencia: '4x por semana',
          dica: 'Priorize técnica de corrida e recuperação adequada entre treinos'
        }
      }
    }
  },
  workout: {
    treinos: {
      // Iniciante
      iniciante: {
        'superior': {
          '18-30': {
            nome: 'Treino de Peito e Tríceps',
            duracao: '45-50 minutos',
            exercicios: [
              { nome: 'Supino reto', series: '3x12', descanso: '60s', dica: 'Controle a descida' },
              { nome: 'Supino inclinado com halteres', series: '3x12', descanso: '60s', dica: 'Pegada neutra' },
              { nome: 'Crucifixo', series: '3x15', descanso: '45s', dica: 'Cotovelos levemente flexionados' },
              { nome: 'Tríceps pulley', series: '3x12', descanso: '45s', dica: 'Cotovelos fixos' },
              { nome: 'Tríceps testa', series: '3x12', descanso: '60s', dica: 'Movimento controlado' }
            ],
            frequencia: '2x por semana',
            dica: 'Foque na execução correta antes de aumentar a carga'
          },
          '31-50': {
            nome: 'Treino de Peito e Tríceps',
            duracao: '40-45 minutos',
            exercicios: [
              { nome: 'Supino reto', series: '3x10', descanso: '75s', dica: 'Aquecimento prévio importante' },
              { nome: 'Supino inclinado', series: '3x10', descanso: '75s', dica: 'Use pegada confortável' },
              { nome: 'Flexão de braço', series: '3x10', descanso: '60s', dica: 'Pode ser com joelhos apoiados' },
              { nome: 'Tríceps pulley', series: '3x12', descanso: '60s', dica: 'Controle o movimento' },
              { nome: 'Mergulho no banco', series: '3x10', descanso: '60s', dica: 'Amplitude reduzida se necessário' }
            ],
            frequencia: '2x por semana',
            dica: 'Priorize aquecimento articular e alongamento ao final'
          },
          '51+': {
            nome: 'Treino de Peito e Tríceps',
            duracao: '35-40 minutos',
            exercicios: [
              { nome: 'Supino máquina', series: '3x10', descanso: '90s', dica: 'Movimento mais seguro' },
              { nome: 'Flexão na parede', series: '3x12', descanso: '60s', dica: 'Baixo impacto' },
              { nome: 'Crucifixo máquina', series: '3x12', descanso: '60s', dica: 'Amplitude confortável' },
              { nome: 'Tríceps pulley', series: '3x10', descanso: '75s', dica: 'Carga moderada' }
            ],
            frequencia: '2x por semana',
            dica: 'Priorize mobilidade e evite cargas muito pesadas'
          }
        },
        'inferior': {
          '18-30': {
            nome: 'Treino de Pernas Completo',
            duracao: '50-55 minutos',
            exercicios: [
              { nome: 'Agachamento livre', series: '3x12', descanso: '90s', dica: 'Joelhos alinhados com os pés' },
              { nome: 'Leg press', series: '3x15', descanso: '75s', dica: 'Pés na largura dos ombros' },
              { nome: 'Cadeira extensora', series: '3x12', descanso: '60s', dica: 'Contração no topo' },
              { nome: 'Mesa flexora', series: '3x12', descanso: '60s', dica: 'Movimento completo' },
              { nome: 'Panturrilha no leg', series: '4x15', descanso: '45s', dica: 'Amplitude máxima' }
            ],
            frequencia: '2x por semana',
            dica: 'Hidrate-se bem durante o treino de pernas'
          },
          '31-50': {
            nome: 'Treino de Pernas Moderado',
            duracao: '45-50 minutos',
            exercicios: [
              { nome: 'Agachamento no smith', series: '3x10', descanso: '90s', dica: 'Mais estável que livre' },
              { nome: 'Leg press', series: '3x12', descanso: '90s', dica: 'Evite travar joelhos' },
              { nome: 'Cadeira extensora', series: '3x12', descanso: '75s', dica: 'Carga moderada' },
              { nome: 'Mesa flexora', series: '3x10', descanso: '75s', dica: 'Sem compensações' },
              { nome: 'Panturrilha sentado', series: '3x15', descanso: '60s', dica: 'Menos impacto' }
            ],
            frequencia: '2x por semana',
            dica: 'Use carga que permita execução perfeita'
          },
          '51+': {
            nome: 'Treino de Pernas Funcional',
            duracao: '35-40 minutos',
            exercicios: [
              { nome: 'Leg press', series: '3x10', descanso: '90s', dica: 'Principal exercício' },
              { nome: 'Cadeira extensora', series: '3x10', descanso: '75s', dica: 'Fortalece joelhos' },
              { nome: 'Cadeira flexora', series: '3x10', descanso: '75s', dica: 'Posterior de coxa' },
              { nome: 'Elevação pélvica', series: '3x12', descanso: '60s', dica: 'Glúteos e lombar' }
            ],
            frequencia: '2x por semana',
            dica: 'Priorize exercícios guiados e seguros'
          }
        },
        'costas': {
          '18-30': {
            nome: 'Treino de Costas e Bíceps',
            duracao: '45-50 minutos',
            exercicios: [
              { nome: 'Puxada frontal', series: '3x12', descanso: '75s', dica: 'Pegada pronada' },
              { nome: 'Remada baixa', series: '3x12', descanso: '75s', dica: 'Contraia as escápulas' },
              { nome: 'Remada unilateral', series: '3x12', descanso: '60s', dica: 'Cada braço' },
              { nome: 'Rosca direta', series: '3x12', descanso: '60s', dica: 'Sem balanço' },
              { nome: 'Rosca martelo', series: '3x12', descanso: '60s', dica: 'Pegada neutra' }
            ],
            frequencia: '2x por semana',
            dica: 'Sinta a contração das costas, não apenas puxe o peso'
          },
          '31-50': {
            nome: 'Treino de Costas e Bíceps',
            duracao: '40-45 minutos',
            exercicios: [
              { nome: 'Puxada frontal', series: '3x10', descanso: '90s', dica: 'Controle a subida' },
              { nome: 'Remada baixa', series: '3x10', descanso: '90s', dica: 'Postura ereta' },
              { nome: 'Puxada triângulo', series: '3x12', descanso: '75s', dica: 'Pegada fechada' },
              { nome: 'Rosca direta', series: '3x10', descanso: '75s', dica: 'Carga moderada' },
              { nome: 'Rosca alternada', series: '3x10', descanso: '60s', dica: 'Um braço por vez' }
            ],
            frequencia: '2x por semana',
            dica: 'Evite compensar com lombar nos exercícios de costas'
          },
          '51+': {
            nome: 'Treino de Costas e Bíceps',
            duracao: '35-40 minutos',
            exercicios: [
              { nome: 'Puxada máquina', series: '3x10', descanso: '90s', dica: 'Movimento guiado' },
              { nome: 'Remada máquina', series: '3x10', descanso: '90s', dica: 'Apoio para costas' },
              { nome: 'Rosca no banco scott', series: '3x10', descanso: '75s', dica: 'Braços apoiados' },
              { nome: 'Rosca martelo', series: '3x10', descanso: '75s', dica: 'Carga leve' }
            ],
            frequencia: '2x por semana',
            dica: 'Use máquinas para maior segurança e estabilidade'
          }
        }
      },
      // Intermediário
      intermediario: {
        'superior': {
          '18-30': {
            nome: 'Treino de Peito e Tríceps Intenso',
            duracao: '55-60 minutos',
            exercicios: [
              { nome: 'Supino reto', series: '4x10', descanso: '90s', dica: 'Aumente a carga progressivamente' },
              { nome: 'Supino inclinado', series: '4x10', descanso: '90s', dica: 'Foco na parte superior' },
              { nome: 'Crucifixo inclinado', series: '3x12', descanso: '60s', dica: 'Alongamento máximo' },
              { nome: 'Paralelas', series: '3x12', descanso: '75s', dica: 'Peito + tríceps' },
              { nome: 'Tríceps francês', series: '3x10', descanso: '60s', dica: 'Barra ou halteres' },
              { nome: 'Tríceps corda', series: '3x12', descanso: '45s', dica: 'Abertura no final' }
            ],
            frequencia: '2-3x por semana',
            dica: 'Varie ângulos e pegadas para desenvolvimento completo'
          },
          '31-50': {
            nome: 'Treino de Peito e Tríceps',
            duracao: '50-55 minutos',
            exercicios: [
              { nome: 'Supino reto', series: '4x8', descanso: '90s', dica: 'Aquecimento progressivo' },
              { nome: 'Supino inclinado halteres', series: '3x10', descanso: '90s', dica: 'Maior amplitude' },
              { nome: 'Crucifixo', series: '3x12', descanso: '75s', dica: 'Isolamento do peitoral' },
              { nome: 'Tríceps pulley', series: '4x10', descanso: '60s', dica: 'Variações de pegada' },
              { nome: 'Tríceps testa', series: '3x10', descanso: '75s', dica: 'Controle excêntrico' }
            ],
            frequencia: '2x por semana',
            dica: 'Mantenha consistência na frequência semanal'
          },
          '51+': {
            nome: 'Treino de Peito e Tríceps',
            duracao: '45-50 minutos',
            exercicios: [
              { nome: 'Supino máquina', series: '3x10', descanso: '90s', dica: 'Seguro e eficaz' },
              { nome: 'Supino halteres', series: '3x10', descanso: '90s', dica: 'Carga moderada' },
              { nome: 'Crucifixo máquina', series: '3x12', descanso: '75s', dica: 'Amplitude confortável' },
              { nome: 'Tríceps pulley', series: '3x12', descanso: '75s', dica: 'Sem sobrecarregar cotovelos' },
              { nome: 'Tríceps no banco', series: '3x10', descanso: '60s', dica: 'Peso corporal' }
            ],
            frequencia: '2x por semana',
            dica: 'Priorize recuperação adequada entre treinos'
          }
        },
        'inferior': {
          '18-30': {
            nome: 'Treino de Pernas Hipertrofia',
            duracao: '60-70 minutos',
            exercicios: [
              { nome: 'Agachamento livre', series: '4x10', descanso: '120s', dica: 'Exercício principal' },
              { nome: 'Agachamento búlgaro', series: '3x12', descanso: '90s', dica: 'Cada perna' },
              { nome: 'Leg press', series: '4x12', descanso: '90s', dica: 'Volume alto' },
              { nome: 'Cadeira extensora', series: '3x15', descanso: '60s', dica: 'Drop set última série' },
              { nome: 'Mesa flexora', series: '3x12', descanso: '75s', dica: 'Posterior forte' },
              { nome: 'Stiff', series: '3x12', descanso: '90s', dica: 'Lombar + posterior' },
              { nome: 'Panturrilha em pé', series: '4x20', descanso: '45s', dica: 'Alto volume' }
            ],
            frequencia: '2x por semana',
            dica: 'Dia de pernas exige mais energia, alimente-se bem'
          },
          '31-50': {
            nome: 'Treino de Pernas Completo',
            duracao: '55-60 minutos',
            exercicios: [
              { nome: 'Agachamento smith', series: '4x10', descanso: '120s', dica: 'Seguro e eficaz' },
              { nome: 'Leg press', series: '4x10', descanso: '90s', dica: 'Principal do treino' },
              { nome: 'Cadeira extensora', series: '3x12', descanso: '75s', dica: 'Isola quadríceps' },
              { nome: 'Mesa flexora', series: '3x12', descanso: '75s', dica: 'Posterior equilibrado' },
              { nome: 'Stiff', series: '3x10', descanso: '90s', dica: 'Cuidado com lombar' },
              { nome: 'Panturrilha sentado', series: '4x15', descanso: '60s', dica: 'Menos impacto' }
            ],
            frequencia: '2x por semana',
            dica: 'Use cinto de musculação em exercícios pesados'
          },
          '51+': {
            nome: 'Treino de Pernas Seguro',
            duracao: '45-50 minutos',
            exercicios: [
              { nome: 'Leg press', series: '4x10', descanso: '120s', dica: 'Exercício principal' },
              { nome: 'Cadeira extensora', series: '3x12', descanso: '90s', dica: 'Fortalece joelhos' },
              { nome: 'Cadeira flexora', series: '3x12', descanso: '90s', dica: 'Posterior importante' },
              { nome: 'Elevação pélvica', series: '3x15', descanso: '75s', dica: 'Glúteos e lombar' },
              { nome: 'Panturrilha sentado', series: '3x15', descanso: '60s', dica: 'Baixo impacto' }
            ],
            frequencia: '2x por semana',
            dica: 'Priorize exercícios guiados em máquinas'
          }
        },
        'costas': {
          '18-30': {
            nome: 'Treino de Costas e Bíceps Intenso',
            duracao: '55-60 minutos',
            exercicios: [
              { nome: 'Barra fixa', series: '4x8-10', descanso: '120s', dica: 'Use elástico se necessário' },
              { nome: 'Remada curvada', series: '4x10', descanso: '90s', dica: 'Exercício composto' },
              { nome: 'Puxada frontal', series: '3x12', descanso: '75s', dica: 'Pegada larga' },
              { nome: 'Remada unilateral', series: '3x12', descanso: '60s', dica: 'Cada lado' },
              { nome: 'Rosca direta barra', series: '4x10', descanso: '75s', dica: 'Barra reta ou W' },
              { nome: 'Rosca martelo', series: '3x12', descanso: '60s', dica: 'Braquial' },
              { nome: 'Rosca concentrada', series: '3x12', descanso: '60s', dica: 'Isolamento' }
            ],
            frequencia: '2-3x por semana',
            dica: 'Desenvolva conexão mente-músculo nas costas'
          },
          '31-50': {
            nome: 'Treino de Costas e Bíceps',
            duracao: '50-55 minutos',
            exercicios: [
              { nome: 'Puxada frontal', series: '4x10', descanso: '90s', dica: 'Fundamental' },
              { nome: 'Remada baixa', series: '4x10', descanso: '90s', dica: 'Meio das costas' },
              { nome: 'Remada unilateral', series: '3x10', descanso: '75s', dica: 'Simetria' },
              { nome: 'Pulldown', series: '3x12', descanso: '75s', dica: 'Largura' },
              { nome: 'Rosca direta', series: '3x10', descanso: '75s', dica: 'Bíceps principal' },
              { nome: 'Rosca alternada', series: '3x12', descanso: '60s', dica: 'Controle' }
            ],
            frequencia: '2x por semana',
            dica: 'Foque em qualidade do movimento, não quantidade de peso'
          },
          '51+': {
            nome: 'Treino de Costas e Bíceps',
            duracao: '40-45 minutos',
            exercicios: [
              { nome: 'Puxada máquina', series: '3x10', descanso: '90s', dica: 'Seguro' },
              { nome: 'Remada máquina', series: '3x10', descanso: '90s', dica: 'Apoio lombar' },
              { nome: 'Remada baixa', series: '3x10', descanso: '90s', dica: 'Postura correta' },
              { nome: 'Rosca scott', series: '3x10', descanso: '75s', dica: 'Apoio para braços' },
              { nome: 'Rosca martelo', series: '3x10', descanso: '75s', dica: 'Antebraços também' }
            ],
            frequencia: '2x por semana',
            dica: 'Evite hiperextensão da lombar'
          }
        }
      },
      // Avançado
      avancado: {
        'superior': {
          '18-30': {
            nome: 'Treino de Peito e Tríceps Avançado',
            duracao: '65-75 minutos',
            exercicios: [
              { nome: 'Supino reto', series: '5x6-8', descanso: '120s', dica: 'Carga pesada' },
              { nome: 'Supino inclinado', series: '4x8', descanso: '90s', dica: 'Peitoral superior' },
              { nome: 'Supino declinado', series: '3x10', descanso: '90s', dica: 'Peitoral inferior' },
              { nome: 'Crucifixo inclinado', series: '4x12', descanso: '60s', dica: 'Alongamento' },
              { nome: 'Paralelas', series: '4x10', descanso: '90s', dica: 'Até falha' },
              { nome: 'Tríceps francês', series: '4x8', descanso: '75s', dica: 'Pesado' },
              { nome: 'Tríceps corda', series: '3x15', descanso: '45s', dica: 'Alto volume' },
              { nome: 'Tríceps coice', series: '3x15', descanso: '45s', dica: 'Isolamento' }
            ],
            frequencia: '3x por semana',
            dica: 'Volume alto + intensidade alta = hipertrofia máxima'
          },
          '31-50': {
            nome: 'Treino de Peito e Tríceps Avançado',
            duracao: '60-65 minutos',
            exercicios: [
              { nome: 'Supino reto', series: '5x8', descanso: '120s', dica: 'Progressão de carga' },
              { nome: 'Supino inclinado halteres', series: '4x10', descanso: '90s', dica: 'Amplitude' },
              { nome: 'Crucifixo', series: '4x12', descanso: '75s', dica: 'Conexão mente-músculo' },
              { nome: 'Crossover', series: '3x15', descanso: '60s', dica: 'Contração no centro' },
              { nome: 'Tríceps pulley', series: '4x10', descanso: '75s', dica: 'Variações' },
              { nome: 'Tríceps francês', series: '3x10', descanso: '75s', dica: 'Controle' },
              { nome: 'Tríceps corda', series: '3x12', descanso: '60s', dica: 'Finalização' }
            ],
            frequencia: '2-3x por semana',
            dica: 'Recuperação é fundamental, não treine dor'
          },
          '51+': {
            nome: 'Treino de Peito e Tríceps',
            duracao: '50-55 minutos',
            exercicios: [
              { nome: 'Supino máquina', series: '4x10', descanso: '90s', dica: 'Principal' },
              { nome: 'Supino halteres', series: '4x10', descanso: '90s', dica: 'Complementar' },
              { nome: 'Crucifixo máquina', series: '3x12', descanso: '75s', dica: 'Isolamento' },
              { nome: 'Crossover', series: '3x12', descanso: '60s', dica: 'Baixa carga' },
              { nome: 'Tríceps pulley', series: '4x10', descanso: '75s', dica: 'Eficaz' },
              { nome: 'Tríceps corda', series: '3x12', descanso: '60s', dica: 'Volume moderado' }
            ],
            frequencia: '2x por semana',
            dica: 'Experiência permite treinar com inteligência'
          }
        },
        'inferior': {
          '18-30': {
            nome: 'Treino de Pernas Avançado',
            duracao: '75-90 minutos',
            exercicios: [
              { nome: 'Agachamento livre', series: '5x6-8', descanso: '180s', dica: 'Pesado e profundo' },
              { nome: 'Agachamento frontal', series: '4x8', descanso: '120s', dica: 'Quadríceps ênfase' },
              { nome: 'Leg press', series: '4x12', descanso: '90s', dica: 'Volume alto' },
              { nome: 'Agachamento búlgaro', series: '4x10', descanso: '90s', dica: 'Cada perna' },
              { nome: 'Cadeira extensora', series: '4x15', descanso: '60s', dica: 'Drop set' },
              { nome: 'Stiff', series: '4x10', descanso: '90s', dica: 'Posterior + lombar' },
              { nome: 'Mesa flexora', series: '4x12', descanso: '75s', dica: 'Isquiotibiais' },
              { nome: 'Adutor', series: '3x15', descanso: '60s', dica: 'Parte interna' },
              { nome: 'Panturrilha em pé', series: '5x20', descanso: '45s', dica: 'Alto volume' }
            ],
            frequencia: '2x por semana',
            dica: 'Treino de pernas avançado é extremamente desgastante'
          },
          '31-50': {
            nome: 'Treino de Pernas Intenso',
            duracao: '65-70 minutos',
            exercicios: [
              { nome: 'Agachamento smith', series: '5x8', descanso: '120s', dica: 'Seguro e eficaz' },
              { nome: 'Leg press', series: '5x10', descanso: '120s', dica: 'Principal' },
              { nome: 'Hack machine', series: '3x10', descanso: '90s', dica: 'Quadríceps' },
              { nome: 'Cadeira extensora', series: '4x12', descanso: '75s', dica: 'Isolamento' },
              { nome: 'Stiff', series: '4x10', descanso: '90s', dica: 'Cuidado lombar' },
              { nome: 'Mesa flexora', series: '4x12', descanso: '75s', dica: 'Posterior' },
              { nome: 'Panturrilha sentado', series: '4x15', descanso: '60s', dica: 'Menos impacto' }
            ],
            frequencia: '2x por semana',
            dica: 'Use equipamentos de proteção como joelheiras se necessário'
          },
          '51+': {
            nome: 'Treino de Pernas Experiente',
            duracao: '55-60 minutos',
            exercicios: [
              { nome: 'Leg press', series: '5x10', descanso: '120s', dica: 'Exercício principal' },
              { nome: 'Cadeira extensora', series: '4x10', descanso: '90s', dica: 'Quadríceps' },
              { nome: 'Cadeira flexora', series: '4x10', descanso: '90s', dica: 'Posterior' },
              { nome: 'Elevação pélvica', series: '4x12', descanso: '75s', dica: 'Glúteos' },
              { nome: 'Abdutora', series: '3x15', descanso: '60s', dica: 'Glúteo médio' },
              { nome: 'Panturrilha sentado', series: '4x15', descanso: '60s', dica: 'Seguro' }
            ],
            frequencia: '2x por semana',
            dica: 'Experiência permite otimizar exercícios para seu corpo'
          }
        },
        'costas': {
          '18-30': {
            nome: 'Treino de Costas e Bíceps Avançado',
            duracao: '70-80 minutos',
            exercicios: [
              { nome: 'Barra fixa', series: '5x6-10', descanso: '120s', dica: 'Até falha' },
              { nome: 'Levantamento terra', series: '4x6', descanso: '180s', dica: 'Composto máximo' },
              { nome: 'Remada curvada', series: '4x8', descanso: '120s', dica: 'Pesado' },
              { nome: 'Puxada frontal', series: '4x10', descanso: '90s', dica: 'Pegada larga' },
              { nome: 'Remada unilateral', series: '4x12', descanso: '60s', dica: 'Cada lado' },
              { nome: 'Pulldown', series: '3x15', descanso: '60s', dica: 'Alto rep' },
              { nome: 'Rosca direta barra', series: '5x8', descanso: '90s', dica: 'Pesado' },
              { nome: 'Rosca 21', series: '3x21', descanso: '90s', dica: '7+7+7' },
              { nome: 'Rosca martelo', series: '4x12', descanso: '60s', dica: 'Volume' },
              { nome: 'Rosca inversa', series: '3x15', descanso: '60s', dica: 'Antebraços' }
            ],
            frequencia: '2-3x por semana',
            dica: 'Costas respondem bem a volume alto e variação de pegadas'
          },
          '31-50': {
            nome: 'Treino de Costas e Bíceps Intenso',
            duracao: '60-70 minutos',
            exercicios: [
              { nome: 'Puxada frontal', series: '5x8', descanso: '120s', dica: 'Principal' },
              { nome: 'Remada curvada', series: '4x8', descanso: '120s', dica: 'Composto' },
              { nome: 'Remada baixa', series: '4x10', descanso: '90s', dica: 'Meio costas' },
              { nome: 'Remada unilateral', series: '3x12', descanso: '75s', dica: 'Simetria' },
              { nome: 'Pulldown', series: '3x12', descanso: '75s', dica: 'Largura' },
              { nome: 'Rosca direta', series: '4x10', descanso: '90s', dica: 'Principal bíceps' },
              { nome: 'Rosca scott', series: '4x10', descanso: '75s', dica: 'Isolamento' },
              { nome: 'Rosca martelo', series: '3x12', descanso: '60s', dica: 'Braquial' }
            ],
            frequencia: '2-3x por semana',
            dica: 'Progressão de carga inteligente, não force lesões'
          },
          '51+': {
            nome: 'Treino de Costas e Bíceps',
            duracao: '55-60 minutos',
            exercicios: [
              { nome: 'Puxada máquina', series: '4x10', descanso: '90s', dica: 'Seguro' },
              { nome: 'Remada máquina', series: '4x10', descanso: '90s', dica: 'Apoio lombar' },
              { nome: 'Remada baixa', series: '4x10', descanso: '90s', dica: 'Fundamental' },
              { nome: 'Pulldown', series: '3x12', descanso: '75s', dica: 'Completar' },
              { nome: 'Rosca scott', series: '4x10', descanso: '75s', dica: 'Principal bíceps' },
              { nome: 'Rosca martelo', series: '3x12', descanso: '60s', dica: 'Complementar' },
              { nome: 'Rosca inversa', series: '3x12', descanso: '60s', dica: 'Antebraços' }
            ],
            frequencia: '2x por semana',
            dica: 'Experiência é valiosa, treine com sabedoria'
          }
        }
      }
    }
  }
};

export function detectContextualInfo(titulo: string, descricao?: string): ContextualWidget[] {
  const text = `${titulo} ${descricao || ''}`.toLowerCase();
  const widgets: ContextualWidget[] = [];

  // Detectar clima (atividades ao ar livre)
  if (keywords.weather.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'weather',
      title: 'Clima Hoje',
      data: mockData.weather,
      icon: '🌤️'
    });
  }

  // Detectar estudo
  if (keywords.study.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'study',
      title: 'Dica de Estudo',
      data: mockData.study,
      icon: '📚'
    });
  }

  // Detectar finanças
  if (keywords.finance.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'finance',
      title: 'Mercado Financeiro',
      data: mockData.finance,
      icon: '📈'
    });
  }

  // Detectar saúde
  if (keywords.health.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'health',
      title: 'Metas de Saúde Diárias',
      data: mockData.health,
      icon: '💪'
    });
  }

  // Detectar compras
  if (keywords.shopping.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'shopping',
      title: '🛒 Lista de Compras Inteligente',
      data: mockData.shopping,
      icon: '🛒'
    });
  }

  // Detectar lembretes
  if (keywords.reminder.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'reminder',
      title: 'Lembrete Importante',
      data: mockData.reminder,
      icon: '🔔'
    });
  }

  // Detectar filmes/séries
  if (keywords.movies.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'movies',
      title: '🎬 Filmes em Alta',
      data: mockData.movies,
      icon: '🎬'
    });
  }

  // Detectar livros/leitura
  if (keywords.books.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'books',
      title: '📖 Livros Mais Lidos',
      data: mockData.books,
      icon: '📖'
    });
  }

  // Detectar cardio
  if (keywords.cardio.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'cardio',
      title: '🏃 Treino de Cardio Personalizado',
      data: mockData.cardio,
      icon: '🏃'
    });
  }

  // Detectar workout (musculação)
  if (keywords.workout.some(keyword => text.includes(keyword))) {
    widgets.push({
      type: 'workout',
      title: '💪 Treino de Musculação Personalizado',
      data: mockData.workout,
      icon: '💪'
    });
  }

  return widgets;
}

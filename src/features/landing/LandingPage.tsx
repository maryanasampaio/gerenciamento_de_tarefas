import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Clock, Bell, Target, TrendingUp, Calendar, Sparkles, Zap } from "lucide-react";
import "./LandingPage.css";

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-cyan-600" />,
      title: "Organização Diária",
      description: "Gerencie suas tarefas de forma simples e eficiente, priorizando o que realmente importa"
    },
    {
      icon: <Clock className="w-8 h-8 text-teal-600" />,
      title: "Controle de Tempo",
      description: "Acompanhe quanto tempo você dedica a cada atividade e otimize sua produtividade"
    },
    {
      icon: <Bell className="w-8 h-8 text-indigo-600" />,
      title: "Lembretes Inteligentes",
      description: "Nunca mais perca um prazo com alertas personalizados no momento certo"
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Metas e Objetivos",
      description: "Defina e acompanhe seus objetivos, celebrando cada conquista no caminho"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-violet-600" />,
      title: "Estatísticas de Progresso",
      description: "Visualize seu crescimento com gráficos e relatórios detalhados"
    },
    {
      icon: <Calendar className="w-8 h-8 text-cyan-700" />,
      title: "Planejamento Semanal",
      description: "Organize sua semana com visão completa de todas as suas responsabilidades"
    }
  ];

  const motivationalPhrases = [
    "Sua jornada produtiva começa aqui",
    "Cada pequeno passo é um grande avanço",
    "Produtividade é fazer o que importa, não apenas estar ocupado",
    "Organize hoje, colha resultados amanhã"
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Suas Tarefas
            <br />
            <span className="gradient-text">Conquiste Seus Objetivos</span>
          </h1>
          
          <p className="hero-description">
            Uma plataforma completa para gerenciar suas tarefas, acompanhar seu progresso
            e alcançar seus objetivos com eficiência e motivação
          </p>

          <div className="hero-buttons">
            <Button 
              size="lg"
              className="button-primary"
              onClick={() => navigate('/cadastro')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Começar Gratuitamente
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="button-secondary"
              onClick={() => navigate('/login')}
            >
              Já tenho conta
            </Button>
          </div>

          {/* Motivational Phrase Carousel */}
          <div className="motivational-carousel">
            <div className="motivational-phrase">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span>{motivationalPhrases[0]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Recursos que Impulsionam sua Produtividade</h2>
          <p className="section-description">
            Ferramentas poderosas para tornar seu dia mais organizado e produtivo
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <h2 className="benefits-title">Por que escolher nossa plataforma?</h2>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Interface intuitiva e fácil de usar</span>
            </div>
            <div className="benefit-item">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Sincronização em tempo real</span>
            </div>
            <div className="benefit-item">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Acesse de qualquer dispositivo</span>
            </div>
            <div className="benefit-item">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span>Totalmente gratuito</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para começar sua jornada?</h2>
          <p className="cta-description">
            Junte-se a milhares de pessoas que já estão alcançando mais com menos esforço
          </p>
          <Button 
            size="lg"
            className="cta-button"
            onClick={() => navigate('/cadastro')}
          >
            Criar Minha Conta Gratuita
          </Button>
        </div>
      </section>
    </div>
  );
};

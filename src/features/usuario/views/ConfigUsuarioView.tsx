import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Mail, 
  MessageSquare,
  Smartphone,
  Save,
  CheckCircle2
} from "lucide-react";

export const ConfigUsuarioView = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [notificacaoApp, setNotificacaoApp] = useState(true);
  const [notificacaoEmail, setNotificacaoEmail] = useState(false);
  const [notificacaoWhatsApp, setNotificacaoWhatsApp] = useState(false);
  const [emailNotificacao, setEmailNotificacao] = useState("");
  const [telefoneWhatsApp, setTelefoneWhatsApp] = useState("");
  
  // Dados do usuário - separar nome e sobrenome
  const nomeCompleto = user?.nome || "";
  const partesNome = nomeCompleto.split(" ");
  const [primeiroNome, setPrimeiroNome] = useState(partesNome[0] || "");
  const [sobrenome, setSobrenome] = useState(partesNome.slice(1).join(" ") || "");
  const [usuario, setUsuario] = useState(user?.usuario || "");
  const [email, setEmail] = useState(user?.email || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleSalvarPreferencias = () => {
    // Aqui você implementaria a lógica para salvar no backend
    const nomeCompleto = `${primeiroNome.trim()} ${sobrenome.trim()}`.trim();
    console.log("Salvando:", { nomeCompleto, usuario, email });
    alert("Preferências salvas com sucesso!");
  };

  const toggleModoEscuro = () => {
    const novoModo = !modoEscuro;
    setModoEscuro(novoModo);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', novoModo.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 relative overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-20"
        } p-6 md:p-8 relative z-10`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configurações
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie sua conta e preferências
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-6xl">
          {/* Informações Pessoais */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Informações Pessoais
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Seus dados da conta
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primeiroNome" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primeiro Nome
                </Label>
                <Input
                  id="primeiroNome"
                  value={primeiroNome}
                  onChange={(e) => setPrimeiroNome(e.target.value)}
                  placeholder="Digite seu primeiro nome"
                  className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sobrenome" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sobrenome
                </Label>
                <Input
                  id="sobrenome"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  placeholder="Digite seu sobrenome"
                  className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usuário
                </Label>
                <Input
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Escolha um nome de usuário"
                  className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Alterar Senha
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Senha Atual
                    </Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                      placeholder="Digite sua senha atual"
                      className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="novaSenha" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nova Senha
                    </Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      placeholder="Digite novamente a nova senha"
                      className="h-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de Aparência */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  {modoEscuro ? (
                    <Moon className="h-6 w-6 text-white" />
                  ) : (
                    <Sun className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Aparência
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Personalize o visual
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  {modoEscuro ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Modo Escuro
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {modoEscuro ? "Tema escuro ativado" : "Tema claro ativado"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleModoEscuro}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    modoEscuro ? "bg-cyan-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      modoEscuro ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Preferências de Notificação */}
          <Card className="md:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Notificações
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Como deseja ser notificado
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
              {/* Notificação do App */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Notificações do Aplicativo
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receba notificações push diretamente no app
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotificacaoApp(!notificacaoApp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificacaoApp ? "bg-cyan-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificacaoApp ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Notificação por E-mail */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Notificações por E-mail
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receba lembretes por e-mail
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificacaoEmail(!notificacaoEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificacaoEmail ? "bg-cyan-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificacaoEmail ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                {notificacaoEmail && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="emailNotif" className="text-sm text-gray-600 dark:text-gray-400">
                      E-mail para notificações
                    </Label>
                    <Input
                      id="emailNotif"
                      type="email"
                      placeholder="seu@email.com"
                      value={emailNotificacao}
                      onChange={(e) => setEmailNotificacao(e.target.value)}
                      className="h-9 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* Notificação por WhatsApp */}
              <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Notificações por WhatsApp
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receba lembretes via WhatsApp
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificacaoWhatsApp(!notificacaoWhatsApp)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notificacaoWhatsApp ? "bg-cyan-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificacaoWhatsApp ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                {notificacaoWhatsApp && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="whatsapp" className="text-sm text-gray-600 dark:text-gray-400">
                      Número do WhatsApp
                    </Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={telefoneWhatsApp}
                      onChange={(e) => setTelefoneWhatsApp(e.target.value)}
                      className="h-9 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Salvar */}
        <div className="max-w-6xl mt-6">
          <Button
            onClick={handleSalvarPreferencias}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-11"
          >
            <Save className="mr-2 h-5 w-5" />
            Salvar Preferências
          </Button>
        </div>
      </main>
    </div>
  );
};

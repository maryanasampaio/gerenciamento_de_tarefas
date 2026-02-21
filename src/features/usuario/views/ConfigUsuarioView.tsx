import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { NotificationSettings } from "@/components/NotificationSettings/NotificationSettings";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";
import { api } from "@/services/api";
import { 
  User, 
  Moon, 
  Sun, 
  Save,
  CheckCircle2,
  Loader2
} from "lucide-react";

export const ConfigUsuarioView = () => {
  const { user, checkAuth } = useAuth();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  
  // Dados do usuário - separar nome e sobrenome
  const nomeCompleto = user?.nome || "";
  const partesNome = nomeCompleto.split(" ");
  const [primeiroNome, setPrimeiroNome] = useState(partesNome[0] || "");
  const [sobrenome, setSobrenome] = useState(partesNome.slice(1).join(" ") || "");
  const [usuario, setUsuario] = useState(user?.usuario || "");
  const [email, setEmail] = useState(user?.email || "");
  const [novaSenha, setNovaSenha] = useState("");

  const handleSalvarPreferencias = async () => {
    setLoading(true);
    try {
      const nomeCompleto = `${primeiroNome.trim()} ${sobrenome.trim()}`.trim();
      
      if (!nomeCompleto || !usuario || !email) {
        toast.error("Campos obrigatórios", "Preencha nome, usuário e e-mail");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("E-mail inválido", "Digite um e-mail válido");
        return;
      }

      await api.put("/usuarios/me", {
        nome: nomeCompleto,
        usuario,
        email
      });

      await checkAuth();
      toast.success("Informações atualizadas", "Seus dados foram salvos com sucesso");
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao salvar informações";
      toast.error("Erro ao salvar", message);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async () => {
    setLoading(true);
    try {
      if (!novaSenha) {
        toast.warning("Campo obrigatório", "Digite a nova senha");
        return;
      }

      if (novaSenha.length < 8) {
        toast.warning("Senha muito curta", "A nova senha deve ter no mínimo 8 caracteres");
        return;
      }

      await api.put("/usuarios/me", {
        nova_senha: novaSenha
      });

      setNovaSenha("");
      toast.success("Senha alterada", "Sua senha foi atualizada com sucesso");
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error || "Erro ao alterar senha";
      toast.error("Erro ao alterar senha", message);
    } finally {
      setLoading(false);
    }
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
                </div>
                
                <div className="pt-4 mt-2">
                  <Button
                    onClick={handleAlterarSenha}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg shadow-red-500/30 transition-all duration-300 h-10"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Alterar Senha
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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

          {/* Notificações Push */}
          <div className="md:col-span-2">
            <NotificationSettings />
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="max-w-6xl mt-6">
          <Button
            onClick={handleSalvarPreferencias}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 h-11"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            Salvar Preferências
          </Button>
        </div>
      </main>
    </div>
  );
};

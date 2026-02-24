 import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { Link, useNavigate } from "react-router-dom"
import { LoginViewModel } from "../viewmodel/AuthViewModel"
import { useToast } from "@/context/ToastContext"
import { useModal } from "@/context/ModalContext"
import { Loader2, LogIn, User, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function LoginView() {
  const {
    handleLogin: originalHandleLogin,
    usuario,
    setUsuario,
    senha,
    setSenha,
    loading,
  } = LoginViewModel();

  const navigate = useNavigate();
  const toast = useToast();
  const modal = useModal();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !senha.trim()) {
      toast.warning("Campos obrigatórios", "Por favor, preencha usuário e senha");
      return;
    }

    try {
      await originalHandleLogin();
      modal.success("Bem-vindo de volta!", "Preparando sua área de trabalho...", 2000);
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/pagina-inicial");
      }, 2000);
    } catch (err: any) {
      console.error("❌ Erro capturado no LoginView:", err);
      console.error("❌ Mensagem do erro:", err.message);
      console.error("❌ Erro completo:", err.response?.data);
      
      const errorMessage = err.message || "Verifique suas credenciais";
      modal.error("Erro ao fazer login", errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <Card className="w-full max-w-md p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl border-0 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 relative z-10 animate-in fade-in duration-500">
        <div className="mb-4 sm:mb-6 text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">Entre na sua conta para continuar organizando suas tarefas</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <Label htmlFor="usuario" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Usuário
            </Label>
            <div className="relative group">
              <Input
                id="usuario"
                type="text"
                placeholder="Digite seu usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
                className="text-sm pl-4 pr-4 h-11 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-600" />
              Senha
            </Label>
            <div className="relative group">
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
                className="text-sm pl-4 pr-12 h-11 border-2 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleLogin();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mt-4 sm:mt-6 h-10 sm:h-11 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-800 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Entrar
              </>
            )}
          </Button>
        </div>

        <div className="mt-4 sm:mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="text-cyan-700 hover:text-teal-700 font-semibold transition-all underline-offset-4 hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/ui/logo"
import { UsuarioViewModel } from "../viewmodel/UsuarioViewModel"
import { Loader2, CheckCircle2, AlertCircle, UserPlus, User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/context/ToastContext"
import { useModal } from "@/context/ModalContext"
import { useState } from "react"
import { UsuarioUseCase } from "../usecases/UsuarioUseCase"

export const CadastroView = () => {
  const {
    nome,
    setNome,
    usuario,
    setUsuario,
    email,
    setEmail,
    senha,
    setSenha,
    handleCancelCadastro 
  } = UsuarioViewModel({ skipLoadAuthenticated: true })

  const toast = useToast()
  const modal = useModal()
  const usuarioUseCase = new UsuarioUseCase()
  
  // Estados separados para nome e sobrenome
  const [primeiroNome, setPrimeiroNome] = useState<string>("")
  const [sobrenome, setSobrenome] = useState<string>("")
  
  const [senhaErro, setSenhaErro] = useState<string>("")
  const [senhaValida, setSenhaValida] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validarSenha = (value: string) => {
    setSenha(value)
    
    if (value.length === 0) {
      setSenhaErro("")
      setSenhaValida(false)
      return
    }
    
    if (value.length < 8) {
      setSenhaErro("A senha deve ter no mínimo 8 caracteres")
      setSenhaValida(false)
    } else {
      setSenhaErro("")
      setSenhaValida(true)
    }
  }

  const handleCadastro = async () => {
    // Juntar nome + sobrenome
    const nomeCompleto = `${primeiroNome.trim()} ${sobrenome.trim()}`.trim()
    
    // Validações
    if (!primeiroNome.trim() || !sobrenome.trim()) {
      toast.warning("Campos obrigatórios", "Por favor, informe nome e sobrenome")
      return
    }
    
    if (!usuario.trim()) {
      toast.warning("Campo obrigatório", "Por favor, escolha um nome de usuário")
      return
    }
    
    if (!email.trim()) {
      toast.warning("Campo obrigatório", "Por favor, informe seu e-mail")
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("E-mail inválido", "Por favor, insira um e-mail válido")
      return
    }
    
    if (senha.length < 8) {
      toast.error("Senha inválida", "A senha deve ter no mínimo 8 caracteres")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await usuarioUseCase.criar(nomeCompleto, usuario, email, senha)
      if (response) {
        modal.success("Conta criada!", "Preparando sua jornada produtiva...", 2000)
        // Redirecionar após 2 segundos
        setTimeout(() => {
          handleCancelCadastro()
        }, 2000)
      }
    } catch (err: any) {
      modal.error("Erro ao cadastrar", err.message || "Tente novamente")
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-xl border-0 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 relative z-10 animate-in fade-in duration-500">
        <CardContent className="p-6 space-y-5">
          <div className="mb-4 text-center space-y-2">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-foreground">Criar sua conta</h1>
              <p className="text-muted-foreground text-xs">Comece a organizar suas tarefas hoje mesmo</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nome + Sobrenome */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-cyan-600" />
                  Nome *
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Nome"
                  value={primeiroNome}
                  onChange={(e) => setPrimeiroNome(e.target.value)}
                  disabled={isSubmitting}
                  className="text-sm h-10 border-2 transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-teal-600" />
                  Sobrenome *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Sobrenome"
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  disabled={isSubmitting}
                  className="text-sm h-10 border-2 transition-all duration-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  required
                />
              </div>
            </div>

            {/* E-mail */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-violet-600" />
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="text-sm h-10 border-2 transition-all duration-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                required
              />
            </div>

            {/* Usuário + Senha */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs font-semibold flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-blue-600" />
                  Usuário *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu.usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  disabled={isSubmitting}
                  className="text-sm h-10 border-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-indigo-600" />
                  Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={senha}
                    onChange={(e) => validarSenha(e.target.value)}
                    disabled={isSubmitting}
                    className={`text-sm h-10 pr-20 border-2 transition-all duration-200 ${
                      senha.length > 0 
                        ? senhaValida 
                          ? "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20" 
                          : "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
                        : "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    }`}
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {senha.length > 0 && (
                      <div>
                        {senhaValida ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                {senhaErro && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3 w-3" />
                    {senhaErro}
                  </p>
                )}
                {senhaValida && (
                  <p className="text-xs text-green-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top-1 duration-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Senha válida!
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-5 h-11 bg-gradient-to-r from-cyan-700 to-teal-700 hover:from-cyan-800 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm" 
              onClick={handleCadastro}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Criar conta
                </>
              )}
            </Button>
          </div>
 
          <div className="flex mt-5 text-center justify-center items-center border-t border-gray-200 dark:border-gray-700 pt-5">
            <Button 
              variant="ghost" 
              onClick={handleCancelCadastro} 
              disabled={isSubmitting}
              className="font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 text-sm h-9"
            >
              <ArrowLeft className="mr-2 h-3.5 w-3.5" />
              Voltar para o login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
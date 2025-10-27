import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { LoginViewModel } from "../viewmodel/AuthViewModel"

export default function LoginView() {
  const {
    handleLogin,
    usuario,
    setUsuario,
    senha,
    setSenha,


  } = LoginViewModel();



  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">TaskFlow</h1>
        <p className="text-muted-foreground">Entre na sua conta</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="usuario">Usuário</Label>
        <Input
          id="usuario"
          type="usuario"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="senha"
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" size="lg" onClick={handleLogin}>
        Entrar
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-primary hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </div>
    </Card>
  )
}

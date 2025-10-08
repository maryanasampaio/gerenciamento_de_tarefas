// src/components/Layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const LayoutApp = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Cabeçalho fixo */}
      <header className="bg-white-600 text-white py-4 px-8 shadow-md">
      </header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-200 text-center py-3 text-sm">
        © 2025 - Todos os direitos reservados
      </footer>
    </div>
  );
};

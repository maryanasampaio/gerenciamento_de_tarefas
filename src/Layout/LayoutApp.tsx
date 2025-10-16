// src/components/Layout.tsx
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const LayoutApp = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header></Header>

      {/* Conteúdo centralizado */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Rodapé */}
      <Footer></Footer>
    </div>
  );
};

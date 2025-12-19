// src/Layout/LayoutApp.tsx
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const LayoutApp = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {isAuthenticated && <Header />}

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {isAuthenticated && <Footer />}
    </div>
  );
};

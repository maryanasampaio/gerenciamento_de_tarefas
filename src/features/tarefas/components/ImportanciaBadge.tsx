import React from "react";
import { cn } from "@/lib/utils"; // helper do ShadCN para combinar classes

interface ImportanciaBadgeProps {
  nivel: "baixa" | "media" | "alta";
}

export const ImportanciaBadge: React.FC<ImportanciaBadgeProps> = ({ nivel }) => {
  const estilos = {
    baixa: "bg-emerald-100 text-emerald-700 border-emerald-300",
    media: "bg-amber-100 text-amber-700 border-amber-300",
    alta: "bg-red-100 text-red-700 border-red-300",
  };

  const textos = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-semibold rounded-full border capitalize select-none",
        estilos[nivel]
      )}
    >
      {textos[nivel]}
    </span>
  );
};

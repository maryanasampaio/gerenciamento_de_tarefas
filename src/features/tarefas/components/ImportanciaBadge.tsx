import { cn } from "@/lib/utils"; // helper do ShadCN para combinar classes

interface ImportanciaBadgeProps {
  nivel: "baixa" | "media" | "alta";
}

export function ImportanciaBadge({ nivel }: ImportanciaBadgeProps) {
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
        "px-2 py-0.5 text-xs font-medium rounded-full border capitalize select-none",
        estilos[nivel]
      )}
    >
      {textos[nivel]}
    </span>
  );
}

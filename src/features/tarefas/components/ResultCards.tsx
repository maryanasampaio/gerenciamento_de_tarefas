import { Card } from "@/components/ui/card";

interface ResultCardsProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  borderColor?: string;
}

export const ResultCards: React.FC<ResultCardsProps> = ({ label, value, icon, iconBg, borderColor = "border-l-primary" }) => (
  <Card className={`p-4 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 ${borderColor} bg-white/90 backdrop-blur-sm`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-muted-foreground mb-2 truncate uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-extrabold text-foreground">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
    </div>
  </Card>
);

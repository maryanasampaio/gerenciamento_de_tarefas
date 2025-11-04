import { Card } from "@/components/ui/card";

interface ResultCardsProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}

export const ResultCards: React.FC<ResultCardsProps> = ({ label, value, icon, iconBg }) => (
  <Card className="p-6 overflow-hidden">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1 truncate">{label}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`h-12 w-12 rounded-full ${iconBg} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </Card>
);

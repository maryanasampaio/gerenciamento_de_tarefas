import { useEffect, useState } from "react";

interface FloatingCardProps {
  position?: string;
  delay?: number;
}

const positionClasses: Record<string, string> = {
  'top-right': 'top-20 right-20',
  'left': 'top-1/2 left-[10%] -translate-y-1/2',
  'right-center': 'top-[48%] right-20 -translate-y-1/2',
  'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2',
  'top-center': 'top-[240px] left-1/2 -translate-x-1/2'
};

export const FloatingCard = ({ position = 'top-left', delay = 0 }: FloatingCardProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => setVisible(true), delay);
    const hideTimeout = setTimeout(() => setVisible(false), delay + 3000);

    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }, 6000);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, [delay]);

  return (
    <div className={`fixed w-[220px] p-4 bg-white rounded-xl shadow-md z-[1] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] max-xl:hidden ${
      positionClasses[position] || 'top-20 left-20'
    } ${
      visible ? 'opacity-30 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        <div className="text-sm font-semibold text-gray-800">Reunião com equipe</div>
      </div>
      <div className="text-xs text-gray-500 mb-2">14:00 - 15:30</div>
      <div className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded">Urgente</div>
    </div>
  );
};

import { useEffect, useState } from "react";

interface NotificationPopProps {
  position?: string;
  delay?: number;
}

const positionClasses: Record<string, string> = {
  'top-center': 'top-[5%] left-1/2',
  'bottom-center': 'bottom-20 left-1/2',
  'left-bottom': 'bottom-[38%] left-[400px]',
  'right-middle': 'top-[2%] right-[400px]'
};

export const NotificationPop = ({ position = 'top-center', delay = 0 }: NotificationPopProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimeout = setTimeout(() => setVisible(true), delay);
    const hideTimeout = setTimeout(() => setVisible(false), delay + 2500);

    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    }, 5500);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, [delay]);

  return (
    <div className={`fixed z-[1] flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl shadow-lg w-[260px] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] max-xl:hidden ${
      positionClasses[position] || 'top-15 left-1/2'
    } ${
      visible ? 'opacity-35 -translate-x-1/2 translate-y-0' : 'opacity-0 -translate-x-1/2 -translate-y-5'
    }`}>
      <div className="text-2xl animate-bounce">🎯</div>
      <div className="flex-1">
        <div className="text-sm font-bold text-gray-800 mb-0.5">Meta alcançada!</div>
        <div className="text-xs text-gray-500">5 tarefas completadas hoje</div>
      </div>
    </div>
  );
};

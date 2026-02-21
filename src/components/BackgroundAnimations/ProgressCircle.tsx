import { useEffect, useState } from "react";

interface ProgressCircleProps {
  position?: string;
  delay?: number;
  targetProgress?: number;
}

const positionClasses: Record<string, string> = {
  'right': 'top-[55%] right-[200px] -translate-y-1/2',
  'top-center': 'top-[140px] left-1/2 -translate-x-1/2',
  'bottom-left': 'bottom-[280px] left-[400px]',
  'left-top': 'top-[25%] left-5',
  'bottom-right': 'bottom-[25%] right-10'
};

export const ProgressCircle = ({ position = 'top-right', delay = 0, targetProgress = 75 }: ProgressCircleProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        current += 5;
        if (current > targetProgress) {
          clearInterval(interval);
        }
        setProgress(current);
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    const resetInterval = setInterval(() => {
      setProgress(0);
      setTimeout(() => {
        let current = 0;
        const interval = setInterval(() => {
          current += 5;
          if (current > targetProgress) {
            clearInterval(interval);
          }
          setProgress(current);
        }, 50);
      }, 500);
    }, 5000 + delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(resetInterval);
    };
  }, [delay, targetProgress]);

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`fixed z-[1] opacity-30 flex flex-col items-center gap-2 max-xl:hidden ${
      positionClasses[position] || 'top-20 right-20'
    }`}>
      <svg width="90" height="90" viewBox="0 0 90 90" className="drop-shadow-md">
        <circle
          cx="45"
          cy="45"
          r="36"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        <circle
          cx="45"
          cy="45"
          r="36"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%] text-xl font-bold text-gray-800">{progress}%</div>
      <div className="text-xs text-gray-500 font-semibold mt-1">Concluído</div>
    </div>
  );
};

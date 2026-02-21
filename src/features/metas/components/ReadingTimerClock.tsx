import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const ReadingTimer: React.FC = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            if (minutes === 0) {
              setIsRunning(false);
              setIsPaused(false);
              playSound();
              return 0;
            } else {
              setMinutes((prevMinutes) => prevMinutes - 1);
              return 59;
            }
          } else {
            return prevSeconds - 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, minutes]);

  const playSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZSA0PVK3n77BdGAg+l9v1xnMpBSuAze/glEILElyw6OysZBgFPJXY88p2KwUqfcrs4JdFDBBbr+fxs2UaCD2T1vPLdysFKXnI7+KaSQ0PVKvm8LJgFgo8kNXzy3csBS15xu3hmUkNDlOq5O+wXxgJPJDU8sp3LAUFKH3L7+OaSQ0OUqnk77FgFgo7jdPxynYrBCl6x+vgmUkNDlKo4+6wYBYJO4vS8Ml2KgUofMPq35lIDg5SpuLusF8WCTuK0O/JdSoFJ3vC6t+ZSA0OUqXh7a5fFgk6iM/uyHUrBSZ6werfmEcNDlGk4O2tXxQJOoXN7sdyKAQmecDp3pZHDQ5Qo9/srV0UCTqEy+zGcScEJXi/6N2WRgwOUKLe66xcEwk5g8nqxHAmBCV3vufclUUMDk+h3OmqWxIJOYLI6cNvJQMkdr3n25VFCw1On9rnqVoRCDmBxue9bSMCJHW75tqURQsMTZ7Z5qhaEAc3f8TlvGwiAiNzueTZk0MLC02d1+SmWRAANoDD5btpIQEicrjj2JJDCgxMnNbnpVkQADV/w+O6aCABIXG24NeRQwkMTJvU5KNYDwA0fsDhuV8gACBxteHWkUMJDExasOGjVw4AMnq94LdfHwAgcLPg1ZBCCAw=');
    audio.play().catch(() => {});
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setMinutes(25);
    setSeconds(0);
  };

  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = ((25 - minutes) * 60 + (60 - seconds)) / (25 * 60);
  
  // Calcular ângulos dos ponteiros
  const minuteAngle = (minutes / 60) * 360;
  const secondAngle = (seconds / 60) * 360;

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center">
        <div className="relative w-52 h-52 mb-4">
          {/* Face do relógio */}
          <div className="absolute inset-0 rounded-full bg-gray-50 dark:bg-slate-700 border-4 border-gray-300 dark:border-gray-600"></div>
          
          {/* Marcações */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = 100 + 85 * Math.cos(angle);
              const y1 = 100 + 85 * Math.sin(angle);
              const x2 = 100 + 75 * Math.cos(angle);
              const y2 = 100 + 75 * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
                  className="text-gray-400 dark:text-gray-500"
                />
              );
            })}
            
            {/* Números */}
            <text x="100" y="30" textAnchor="middle" className="text-base font-medium fill-gray-600 dark:fill-gray-400">12</text>
            <text x="170" y="105" textAnchor="middle" className="text-base font-medium fill-gray-600 dark:fill-gray-400">3</text>
            <text x="100" y="180" textAnchor="middle" className="text-base font-medium fill-gray-600 dark:fill-gray-400">6</text>
            <text x="30" y="105" textAnchor="middle" className="text-base font-medium fill-gray-600 dark:fill-gray-400">9</text>
            
            {/* Ponteiro dos minutos */}
            <line
              x1="100"
              y1="100"
              x2={100 + 55 * Math.sin((minuteAngle * Math.PI) / 180)}
              y2={100 - 55 * Math.cos((minuteAngle * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-gray-700 dark:text-gray-300"
            />
            
            {/* Ponteiro dos segundos */}
            <line
              x1="100"
              y1="100"
              x2={100 + 65 * Math.sin((secondAngle * Math.PI) / 180)}
              y2={100 - 65 * Math.cos((secondAngle * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-red-500"
            />
            
            {/* Centro */}
            <circle cx="100" cy="100" r="4" className="fill-gray-700 dark:fill-gray-300" />
          </svg>
          
          {/* Display digital */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 dark:bg-slate-800/95 px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 mt-12">
              <div className="text-xl font-mono font-semibold text-gray-900 dark:text-white">
                {formatTime(minutes, seconds)}
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {isRunning && !isPaused ? 'Lendo' : isPaused ? 'Pausado' : 'Pronto'}
            </div>
          </div>
        </div>

        {/* Controles Compactos */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button
                  onClick={handlePause}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Pause className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleResume}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="border-emerald-300 dark:border-emerald-700"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

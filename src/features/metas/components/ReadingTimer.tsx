import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, BookOpen } from 'lucide-react';
import { SoundService } from '@/services/soundService';

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
              // Timer completado
              setIsRunning(false);
              setIsPaused(false);
              SoundService.playTimerComplete();
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
    // Som de notificação ao completar
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZSA0PVK3n77BdGAg+l9v1xnMpBSuAze/glEILElyw6OysZBgFPJXY88p2KwUqfcrs4JdFDBBbr+fxs2UaCD2T1vPLdysFKXnI7+KaSQ0PVKvm8LJgFgo8kNXzy3csBS15xu3hmUkNDlOq5O+wXxgJPJDU8sp3LAUFKH3L7+OaSQ0OUqnk77FgFgo7jdPxynYrBCl6x+vgmUkNDlKo4+6wYBYJO4vS8Ml2KgUofMPq35lIDg5SpuLusF8WCTuK0O/JdSoFJ3vC6t+ZSA0OUqXh7a5fFgk6iM/uyHUrBSZ6werfmEcNDlGk4O2tXxQJOoXN7sdyKAQmecDp3pZHDQ5Qo9/srV0UCTqEy+zGcScEJXi/6N2WRgwOUKLe66xcEwk5g8nqxHAmBCV3vufclUUMDk+h3OmqWxIJOYLI6cNvJQMkdr3n25VFCw1On9rnqVoRCDmBxue9bSMCJHW75tqURQsMTZ7Z5qhaEAc3f8TlvGwiAiNzueTZk0MLC02d1+SmWRAANoDD5btpIQEicrjj2JJDCgxMnNbnpVkQADV/w+O6aCABIXG24NeRQwkMTJvU5KNYDwA0fsDhuV8gACBxteHWkUMJDExasOGjVw4AMnq94LdfHwAgcLPg1ZBCCAw=');
    audio.play().catch(() => {}); // Ignora erro se navegador bloquear
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

  const progress = ((25 - minutes) * 60 + (60 - seconds)) / (25 * 60) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-emerald-600 dark:bg-emerald-700">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
            Timer de Leitura
          </h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Sessão de 25 minutos
          </p>
        </div>
      </div>

      {/* Display do Timer */}
      <div className="relative mb-6">
        <div className="text-center py-8 bg-white/50 dark:bg-slate-900/50 rounded-xl backdrop-blur-sm">
          <div className="text-6xl font-bold text-emerald-900 dark:text-emerald-100 font-mono">
            {formatTime(minutes, seconds)}
          </div>
          <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-2">
            {isRunning && !isPaused ? '📖 Lendo...' : isPaused ? '⏸️ Pausado' : '🎯 Pronto para começar'}
          </div>
        </div>

        {/* Barra de Progresso */}
        {isRunning && (
          <div className="mt-4 h-2 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            <Play className="h-4 w-4 mr-2" />
            Iniciar
          </Button>
        ) : (
          <>
            {!isPaused ? (
              <Button
                onClick={handlePause}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </Button>
            ) : (
              <Button
                onClick={handleResume}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
              >
                <Play className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            )}
          </>
        )}
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reiniciar
        </Button>
      </div>
    </Card>
  );
};

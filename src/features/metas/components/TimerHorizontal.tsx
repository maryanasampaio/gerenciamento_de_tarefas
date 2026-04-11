import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, X, Coffee } from 'lucide-react';
import { SoundService } from '@/services/soundService';

interface TimerHorizontalProps {
  onComplete?: () => void;
  onClose?: () => void;
}

export function TimerHorizontal({ onComplete, onClose }: TimerHorizontalProps) {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const durations = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    SoundService.playNotification();
    
    if (mode === 'pomodoro' && onComplete) {
      onComplete();
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((durations[mode] - timeLeft) / durations[mode]) * 100;
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Botão Fechar */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Relógio Circular Compacto */}
      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
        {/* Círculo de Progresso */}
        <svg className="absolute inset-0 w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - getProgress() / 100)}`}
            className={`transition-all duration-1000 ${
              mode === 'pomodoro' 
                ? 'text-cyan-600' 
                : mode === 'shortBreak'
                ? 'text-green-600'
                : 'text-blue-600'
            }`}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Tempo */}
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Seletor de Modo - Horizontal */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'pomodoro' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('pomodoro')}
          className={mode === 'pomodoro' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
        >
          Foco
        </Button>
        <Button
          variant={mode === 'shortBreak' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('shortBreak')}
          className={mode === 'shortBreak' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          <Coffee className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Pausa</span>
        </Button>
        <Button
          variant={mode === 'longBreak' ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchMode('longBreak')}
          className={mode === 'longBreak' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <Coffee className="h-3 w-3 sm:mr-1" />
          <span className="hidden sm:inline">Longa</span>
        </Button>
      </div>

      {/* Controles - Horizontal */}
      <div className="flex gap-2">
        <Button
          onClick={toggleTimer}
          size="sm"
          className={`${
            mode === 'pomodoro'
              ? 'bg-cyan-600 hover:bg-cyan-700'
              : mode === 'shortBreak'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Pausar</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Iniciar</span>
            </>
          )}
        </Button>
        <Button
          onClick={resetTimer}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

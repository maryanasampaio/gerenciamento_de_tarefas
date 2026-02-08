import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Clock, Coffee } from 'lucide-react';

interface StudyTimerProps {
  onComplete?: () => void;
}

export function StudyTimer({ onComplete }: StudyTimerProps) {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
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
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'pomodoro') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);
      
      // Notificar conclusão
      if (onComplete) onComplete();
      
      // Tocar som (opcional)
      playNotificationSound();
      
      // Sugerir pausa
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(durations.longBreak);
      } else {
        setMode('shortBreak');
        setTimeLeft(durations.shortBreak);
      }
    } else {
      // Fim da pausa, voltar ao pomodoro
      setMode('pomodoro');
      setTimeLeft(durations.pomodoro);
    }
  };

  const playNotificationSound = () => {
    // Cria um beep simples usando Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
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
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200 dark:border-purple-800">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Timer de Estudos
          </h3>
        </div>

        {/* Seletor de Modo */}
        <div className="flex gap-2 w-full">
          <Button
            variant={mode === 'pomodoro' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('pomodoro')}
            className={mode === 'pomodoro' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            Foco (25min)
          </Button>
          <Button
            variant={mode === 'shortBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('shortBreak')}
            className={mode === 'shortBreak' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Coffee className="h-3 w-3 mr-1" />
            Pausa (5min)
          </Button>
          <Button
            variant={mode === 'longBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('longBreak')}
            className={mode === 'longBreak' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Coffee className="h-3 w-3 mr-1" />
            Pausa Longa (15min)
          </Button>
        </div>

        {/* Timer Display */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Círculo de Progresso */}
          <svg className="absolute inset-0 w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgress() / 100)}`}
              className={`transition-all duration-1000 ${
                mode === 'pomodoro' 
                  ? 'text-purple-600' 
                  : mode === 'shortBreak'
                  ? 'text-green-600'
                  : 'text-blue-600'
              }`}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Tempo */}
          <div className="text-5xl font-bold text-gray-900 dark:text-white">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controles */}
        <div className="flex gap-3">
          <Button
            onClick={toggleTimer}
            size="lg"
            className={`${
              mode === 'pomodoro'
                ? 'bg-purple-600 hover:bg-purple-700'
                : mode === 'shortBreak'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-8`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Iniciar
              </>
            )}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Contador de Pomodoros */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Pomodoros completados:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">{pomodorosCompleted}</span>
        </div>

        {/* Dicas */}
        {!isRunning && timeLeft === durations[mode] && (
          <div className="w-full p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <p className="text-xs text-purple-700 dark:text-purple-300 text-center">
              {mode === 'pomodoro' 
                ? '🎯 Foque em uma tarefa por vez. Elimine distrações!'
                : '☕ Hora de descansar! Levante-se, estique-se ou hidrate-se.'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

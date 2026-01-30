import { useEffect, useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface TaskAnimationProps {
  tasks?: string[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
  delay?: number;
}

const positionClasses = {
  'top-left': 'top-10 left-10',
  'top-right': 'top-10 right-10',
  'bottom-left': 'bottom-10 left-10',
  'bottom-right': 'bottom-10 right-10',
  'left': 'top-[15%] left-20',
  'right': 'bottom-[30%] right-20'
};

export const TaskAnimation = ({ 
  tasks: customTasks = ["Planejar o dia", "Responder e-mails", "Finalizar tarefas"],
  position = 'bottom-left',
  delay = 0
}: TaskAnimationProps) => {
  const [tasks, setTasks] = useState<Task[]>(
    customTasks.map((text, index) => ({ id: index + 1, text, completed: false }))
  );

  useEffect(() => {
    // Animar tarefas em loop
    const timings = [1000 + delay, 2000 + delay, 3000 + delay];
    const resetTime = 5000 + delay;

    const timeouts = tasks.map((task, index) => {
      return setTimeout(() => {
        setTasks(prev => 
          prev.map(t => t.id === task.id ? { ...t, completed: true } : t)
        );
      }, timings[index]);
    });

    // Reset após todas as animações
    const resetTimeout = setTimeout(() => {
      setTasks(prev => prev.map(t => ({ ...t, completed: false })));
    }, resetTime);

    // Loop contínuo
    const loopInterval = setInterval(() => {
      setTasks(prev => prev.map(t => ({ ...t, completed: false })));
      
      tasks.forEach((task, index) => {
        setTimeout(() => {
          setTasks(prev => 
            prev.map(t => t.id === task.id ? { ...t, completed: true } : t)
          );
        }, timings[index]);
      });
    }, resetTime + 1000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(resetTimeout);
      clearInterval(loopInterval);
    };
  }, [delay]);

  return (
    <div className={`w-[280px] fixed z-[1] opacity-35 max-xl:hidden ${positionClasses[position]}`}>
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="flex items-center mb-4 animate-slideIn"
          style={{
            animationDelay: `${[300, 1500, 2700][index]}ms`
          }}
        >
          <span className={`min-w-[22px] w-[22px] h-[22px] border-[2.5px] rounded-md mr-3 relative flex items-center justify-center transition-all duration-500 ${
            task.completed ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-indigo-600'
          }`}>
            {task.completed && <span className="text-white text-xs font-bold">✓</span>}
          </span>
          <span className={`text-sm text-gray-800 transition-all duration-300 ${
            task.completed ? 'line-through opacity-50' : ''
          }`}>{task.text}</span>
        </div>
      ))}
    </div>
  );
};

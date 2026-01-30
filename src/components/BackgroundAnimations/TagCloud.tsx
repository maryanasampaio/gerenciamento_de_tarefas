import { useEffect, useState } from "react";

interface TagCloudProps {
  position?: string;
  delay?: number;
}

const tags = ["Design", "Desenvolvimento", "Marketing", "Vendas", "Suporte"];

const positionClasses: Record<string, string> = {
  'top-left': 'top-[280px] left-[400px]',
  'right': 'top-1/2 right-10 -translate-y-1/2',
  'bottom-right': 'bottom-[350px] right-[400px]',
  'top-center': 'top-[200px] left-1/2 -translate-x-1/2',
  'left-middle': 'top-[60%] left-[400px] -translate-y-1/2'
};

export const TagCloud = ({ position = 'left', delay = 0 }: TagCloudProps) => {
  const [activeTags, setActiveTags] = useState<number[]>([]);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      tags.forEach((_, index) => {
        setTimeout(() => {
          setActiveTags(prev => [...prev, index]);
        }, index * 400);
      });
    }, delay);

    const resetInterval = setInterval(() => {
      setActiveTags([]);
      setTimeout(() => {
        tags.forEach((_, index) => {
          setTimeout(() => {
            setActiveTags(prev => [...prev, index]);
          }, index * 400);
        });
      }, 500);
    }, 6000 + delay);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(resetInterval);
    };
  }, [delay]);

  return (
    <div className={`fixed z-[1] flex flex-wrap gap-2 w-[200px] max-xl:hidden ${
      positionClasses[position] || 'top-20 left-20'
    }`}>
      {tags.map((tag, index) => (
        <div
          key={index}
          className={`px-3.5 py-1.5 bg-indigo-50 text-indigo-600 text-[13px] font-semibold rounded-full transition-all duration-300 ${
            activeTags.includes(index) ? 'opacity-40 scale-100' : 'opacity-0 scale-80'
          }`}
        >
          #{tag}
        </div>
      ))}
    </div>
  );
};

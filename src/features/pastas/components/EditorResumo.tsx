import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading1, Heading2, Heading3, Highlighter } from 'lucide-react';

interface EditorResumoProps {
  conteudo: string;
  onChange: (conteudo: string) => void;
}

const coresMarcaTexto = [
  { nome: 'Amarelo', classe: 'bg-yellow-200 dark:bg-yellow-800' },
  { nome: 'Verde', classe: 'bg-green-200 dark:bg-green-800' },
  { nome: 'Azul', classe: 'bg-blue-200 dark:bg-blue-800' },
  { nome: 'Rosa', classe: 'bg-pink-200 dark:bg-pink-800' },
  { nome: 'Roxo', classe: 'bg-purple-200 dark:bg-purple-800' },
  { nome: 'Laranja', classe: 'bg-orange-200 dark:bg-orange-800' },
];

export const EditorResumo = ({ conteudo, onChange }: EditorResumoProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mostrarCores, setMostrarCores] = useState(false);
  const isUpdatingRef = useRef(false);

  // Atualiza o conteúdo apenas quando vier de fora (não durante edição do usuário)
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current && editorRef.current.innerHTML !== conteudo) {
      editorRef.current.innerHTML = conteudo;
    }
  }, [conteudo]);

  const executarComando = (comando: string) => {
    const selection = globalThis.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) return;

    let element: HTMLElement;
    
    if (comando === 'bold') {
      element = document.createElement('strong');
    } else if (comando === 'italic') {
      element = document.createElement('em');
    } else {
      return;
    }

    element.textContent = selectedText;
    range.deleteContents();
    range.insertNode(element);
    selection.removeAllRanges();
    
    editorRef.current?.focus();
  };

  const aplicarEstilo = (tag: string) => {
    const selection = globalThis.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      const element = document.createElement(tag);
      range.deleteContents();
      element.textContent = selectedText;
      range.insertNode(element);
      selection.removeAllRanges();
    }
    
    editorRef.current?.focus();
  };

  const aplicarMarcador = (corClasse: string) => {
    const selection = globalThis.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      const span = document.createElement('span');
      span.className = `${corClasse} px-1 rounded`;
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
      selection.removeAllRanges();
    }
    
    setMostrarCores(false);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      isUpdatingRef.current = true;
      onChange(editorRef.current.innerHTML);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Barra de Ferramentas */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center gap-1 flex-wrap">
        {/* Títulos */}
        <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => aplicarEstilo('h1')}
            title="Título 1"
            className="h-8 w-8 p-0"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => aplicarEstilo('h2')}
            title="Título 2"
            className="h-8 w-8 p-0"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => aplicarEstilo('h3')}
            title="Título 3"
            className="h-8 w-8 p-0"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Formatação de texto */}
        <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executarComando('bold')}
            title="Negrito"
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => executarComando('italic')}
            title="Itálico"
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
        </div>

        {/* Marca-texto */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarCores(!mostrarCores)}
            title="Marca-texto"
            className="h-8 px-2 gap-1"
          >
            <Highlighter className="h-4 w-4" />
            <span className="text-xs">Marcar</span>
          </Button>
          
          {mostrarCores && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10 flex gap-1">
              {coresMarcaTexto.map((cor) => (
                <button
                  key={cor.nome}
                  onClick={() => aplicarMarcador(cor.classe)}
                  className={`w-8 h-8 rounded ${cor.classe} border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 transition-colors`}
                  title={cor.nome}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Área de Edição */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] overflow-x-hidden p-4 focus:outline-none bg-white dark:bg-gray-950 break-words"
        style={{
          lineHeight: '1.6',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
        suppressContentEditableWarning
      />

      {/* Estilos para o conteúdo editável */}
      <style>{`
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.4em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.3em 0;
        }
        [contenteditable] p {
          margin: 0.5em 0;
        }
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

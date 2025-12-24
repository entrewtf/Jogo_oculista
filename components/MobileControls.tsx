import React from 'react';
import { Direction } from '../types';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileControlsProps {
  onInput: (dir: Direction) => void;
}

const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
  // touch-action: none impede o scroll acidental e o double-tap zoom que causa lag
  // select-none impede que o texto/botões sejam selecionados ao clicar rápido
  const btnClass = "w-16 h-16 sm:w-20 sm:h-20 bg-neutral-800 rounded-full flex items-center justify-center active:bg-amber-500 active:text-black transition-colors border border-neutral-700 touch-manipulation shadow-lg select-none touch-none";

  const handlePointerDown = (e: React.PointerEvent, dir: Direction) => {
    // Evita comportamentos padrão do navegador e propaga apenas o nosso evento
    e.preventDefault();
    onInput(dir);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black to-transparent z-50 flex justify-center items-center gap-4">
       <div className="grid grid-cols-3 gap-2">
          {/* Espaço Vazio Superior Esquerdo */}
          <div></div>
          <button 
            className={btnClass}
            onPointerDown={(e) => handlePointerDown(e, Direction.UP)}
            aria-label="Cima"
          >
            <ArrowUp size={32} />
          </button>
          {/* Espaço Vazio Superior Direito */}
          <div></div>

          <button 
            className={btnClass}
            onPointerDown={(e) => handlePointerDown(e, Direction.LEFT)}
            aria-label="Esquerda"
          >
            <ArrowLeft size={32} />
          </button>
          
          <button 
            className={btnClass}
            onPointerDown={(e) => handlePointerDown(e, Direction.DOWN)}
            aria-label="Baixo"
          >
            <ArrowDown size={32} />
          </button>
          
          <button 
            className={btnClass}
            onPointerDown={(e) => handlePointerDown(e, Direction.RIGHT)}
            aria-label="Direita"
          >
            <ArrowRight size={32} />
          </button>
       </div>
    </div>
  );
};

export default MobileControls;
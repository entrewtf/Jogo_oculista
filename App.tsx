import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Direction, SymbolItem } from './types';
import { GAME_DURATION_SECONDS, COUNTDOWN_SECONDS, SYMBOL_COUNT, KEY_MAP } from './constants';
import Optotype from './components/Optotype';
import MobileControls from './components/MobileControls';
import { Play, RotateCcw, HelpCircle, Trophy, Eye } from 'lucide-react';

const generateSymbols = (count: number): SymbolItem[] => {
  const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  return Array.from({ length: count }).map((_, i) => ({
    id: `sym-${i}`,
    direction: directions[Math.floor(Math.random() * directions.length)],
    status: 'pending',
  }));
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [symbols, setSymbols] = useState<SymbolItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [stats, setStats] = useState({ correct: 0, errors: 0 });
  
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialSymbol, setTutorialSymbol] = useState<Direction>(Direction.RIGHT);

  const timerRef = useRef<number | null>(null);
  const activeSymbolRef = useRef<HTMLDivElement | null>(null);
  
  // Ref para evitar cliques duplos (debounce)
  const lastInputTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    const newSymbols = generateSymbols(SYMBOL_COUNT);
    newSymbols[0].status = 'current';
    setSymbols(newSymbols);
    setCurrentIndex(0);
    setStats({ correct: 0, errors: 0 });
    setGameState(GameState.COUNTDOWN);
    setTimeLeft(COUNTDOWN_SECONDS);
    window.focus();
  }, []);

  const handleInput = useCallback((inputDir: Direction) => {
    // Trava de segurança contra cliques duplos (debounce de 80ms)
    const now = Date.now();
    if (now - lastInputTimeRef.current < 80) return;
    lastInputTimeRef.current = now;

    if (gameState === GameState.TUTORIAL) {
      handleTutorialInput(inputDir);
      return;
    }

    if (gameState !== GameState.PLAYING) return;

    const currentSymbol = symbols[currentIndex];
    if (!currentSymbol) return;

    const isCorrect = currentSymbol.direction === inputDir;

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      errors: prev.errors + (isCorrect ? 0 : 1),
    }));

    const newSymbols = [...symbols];
    newSymbols[currentIndex].status = isCorrect ? 'correct' : 'wrong';
    
    const nextIndex = currentIndex + 1;
    if (nextIndex < newSymbols.length) {
      newSymbols[nextIndex].status = 'current';
      setCurrentIndex(nextIndex);
    } else {
      endGame();
    }
    setSymbols(newSymbols);

  }, [gameState, currentIndex, symbols]);

  const handleTutorialInput = (inputDir: Direction) => {
    if (inputDir === tutorialSymbol) {
      if (tutorialStep < 3) {
        setTutorialStep(prev => prev + 1);
        const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
        setTutorialSymbol(directions[Math.floor(Math.random() * directions.length)]);
      } else {
        startGame();
      }
    }
  };

  const endGame = useCallback(() => {
    setGameState(GameState.FINISHED);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_MAP[e.key];
      if (dir) {
        e.preventDefault();
        handleInput(dir);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  useEffect(() => {
    if (gameState === GameState.COUNTDOWN) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameState(GameState.PLAYING);
            return GAME_DURATION_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === GameState.PLAYING) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, endGame]);

  useEffect(() => {
    if (gameState === GameState.PLAYING && activeSymbolRef.current) {
      activeSymbolRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [currentIndex, gameState]);

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-12 animate-fade-in">
      <div className="space-y-4">
        <div className="w-24 h-24 mx-auto bg-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
           <Eye size={48} className="text-black" />
        </div>
        <h1 className="text-5xl font-light tracking-tighter text-white">
          Jogo do <span className="text-amber-500 font-medium">Oculista</span>
        </h1>
        <p className="text-neutral-400 font-light text-lg max-w-md mx-auto leading-relaxed">
          Teste sua velocidade de processamento visual. Identifique a direção do "E" o mais rápido possível.
        </p>
      </div>

      <div className="flex flex-col w-full max-w-xs gap-4">
        <button 
          onClick={startGame}
          className="group relative w-full py-4 bg-white text-black text-xl font-semibold rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <Play size={24} className="fill-current" /> JOGAR
          </span>
        </button>
        
        <button 
          onClick={() => {
            setGameState(GameState.TUTORIAL);
            setTutorialStep(0);
          }}
          className="w-full py-4 bg-neutral-900 border border-neutral-800 text-neutral-300 text-lg font-light rounded-full hover:border-amber-500/50 hover:text-amber-500 transition-all active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <HelpCircle size={20} /> Como Jogar
          </span>
        </button>
      </div>
    </div>
  );

  const renderTutorial = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-amber-500 tracking-tight">Tutorial ({tutorialStep + 1}/4)</h2>
        <p className="text-neutral-400">Para onde o "E" está apontando?</p>
      </div>
      <div className="p-12 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl">
        <Optotype direction={tutorialSymbol} status="current" isActive size="xl" />
      </div>
      <button 
        onClick={startGame} 
        className="text-white underline decoration-amber-500 underline-offset-4 hover:text-amber-500 transition-colors"
      >
        Pular Tutorial
      </button>
      <MobileControls onInput={handleTutorialInput} />
    </div>
  );

  const renderCountdown = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-500 text-black">
      <div className="text-9xl font-bold tracking-tighter animate-pulse">
        {timeLeft > 0 ? timeLeft : 'VAI!'}
      </div>
      <p className="mt-4 text-xl font-medium tracking-wide">PREPARE-SE</p>
    </div>
  );

  const renderGame = () => (
    <div className="min-h-screen flex flex-col relative pb-48 sm:pb-10">
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 p-4 flex justify-between items-center text-lg font-medium">
        <div className="flex items-center gap-2 text-amber-500">
           <span>⏱</span>
           <span className="tabular-nums font-mono text-2xl">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end leading-none">
             <span className="text-xs text-neutral-500 uppercase tracking-wider">Pontos</span>
             <span className="text-xl text-white tabular-nums">{stats.correct}</span>
           </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-8 flex justify-center items-start overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 sm:gap-6 w-full max-w-6xl">
          {symbols.map((sym, index) => (
            <div 
              key={sym.id} 
              id={`symbol-${index}`}
              ref={index === currentIndex ? activeSymbolRef : null}
              className="flex justify-center"
            >
              <Optotype 
                direction={sym.direction} 
                status={sym.status} 
                isActive={index === currentIndex} 
                size="md"
              />
            </div>
          ))}
        </div>
      </main>
      <MobileControls onInput={handleInput} />
    </div>
  );

  const renderResults = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-10 animate-fade-in">
       <div className="space-y-2">
         <h2 className="text-3xl font-light tracking-tight text-white">Tempo Esgotado!</h2>
         <p className="text-neutral-500">Vamos ver como está sua visão.</p>
       </div>
       <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
         <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center">
            <span className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Acertos</span>
            <span className="text-5xl font-light text-green-500 tabular-nums">{stats.correct}</span>
         </div>
         <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center">
            <span className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Erros</span>
            <span className="text-5xl font-light text-red-500 tabular-nums">{stats.errors}</span>
         </div>
       </div>
       <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 w-full max-w-sm">
          <div className="flex items-center justify-center gap-2 text-amber-500 font-medium">
            <Trophy size={20} />
            <span>Resultado Final: {stats.correct - stats.errors} pts</span>
          </div>
       </div>
       <button 
          onClick={startGame}
          className="w-full max-w-xs py-4 bg-amber-500 text-black text-xl font-bold rounded-full hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]"
        >
          <span className="flex items-center justify-center gap-2">
            <RotateCcw size={24} /> Tentar Novamente
          </span>
       </button>
       <button onClick={() => setGameState(GameState.MENU)} className="text-neutral-500 hover:text-white transition-colors text-sm">
         Voltar ao Menu
       </button>
    </div>
  );

  switch (gameState) {
    case GameState.TUTORIAL: return renderTutorial();
    case GameState.COUNTDOWN: return renderCountdown();
    case GameState.PLAYING: return renderGame();
    case GameState.FINISHED: return renderResults();
    default: return renderMenu();
  }
};

export default App;
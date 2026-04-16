import React from 'react';
import { Trophy, Home, User, Bot } from 'lucide-react';

interface UIOverlayProps {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  currentPlayer: number;
  gameOver: boolean;
  winner: string | null;
  onGoHome: () => void;
  isPvC?: boolean;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  currentPlayer,
  gameOver,
  winner,
  onGoHome,
  isPvC = false
}) => {
  return (
    <div className="w-full max-w-5xl mb-6 flex flex-col items-center gap-4">
      <div className="flex justify-between w-full items-center bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
        
        {/* Home Button */}
        <button 
          onClick={onGoHome}
          className="p-3 bg-amber-900/30 hover:bg-amber-500/20 text-amber-200 rounded-xl transition-all hover:scale-105 border border-amber-500/20"
          title="ወደ መጀመሪያ ገጽ"
        >
          <Home size={24} />
        </button>

        {/* Player 1 Dashboard */}
        <div className={`flex items-center gap-4 px-6 py-2 rounded-xl transition-all duration-500 ${currentPlayer === 1 ? 'bg-amber-500/20 ring-2 ring-amber-500 scale-105' : 'opacity-40 grayscale'}`}>
          <div className="bg-amber-600/30 p-2 rounded-lg">
            <User className="text-amber-500" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-tighter text-amber-200/70 font-bold">ተጫዋች 1</span>
            <span className="text-lg font-black truncate max-w-[120px] italic">{player1Name}</span>
          </div>
          <div className="text-3xl font-black text-amber-500 ml-2">{player1Score}</div>
        </div>

        {/* Logo/Center Area */}
        <div className="hidden md:flex flex-col items-center">
          <div className="text-xl font-black italic text-amber-800 tracking-widest">Gebeta/ገበጣ</div>
          <div className="h-1 w-12 bg-amber-900/50 rounded-full"></div>
        </div>

        {/* Player 2 Dashboard */}
        <div className={`flex items-center gap-4 px-6 py-2 rounded-xl transition-all duration-500 ${currentPlayer === 2 ? 'bg-amber-500/20 ring-2 ring-amber-500 scale-105' : 'opacity-40 grayscale'}`}>
          <div className="text-3xl font-black text-amber-500 mr-2">{player2Score}</div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-tighter text-amber-200/70 font-bold">{isPvC ? 'ኮምፒውተር' : 'ተጫዋች 2'}</span>
            <span className="text-lg font-black truncate max-w-[120px] italic">{player2Name}</span>
          </div>
          <div className="bg-amber-600/30 p-2 rounded-lg">
            {isPvC ? <Bot className="text-amber-500" size={24} /> : <User className="text-amber-500" size={24} />}
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-gradient-to-b from-amber-800 to-amber-950 p-12 rounded-[3rem] border-4 border-amber-400 text-center shadow-[0_0_100px_rgba(251,191,36,0.5)] transform animate-in zoom-in-95 duration-500">
            <div className="relative mb-6">
              <Trophy className="w-24 h-24 text-amber-400 mx-auto drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
              <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-xs font-black px-2 py-1 rounded-full">WINNER</div>
            </div>
            <h2 className="text-5xl font-black mb-2 text-white italic">አሸናፊ!</h2>
            <p className="text-2xl text-amber-200 mb-10 font-bold uppercase tracking-widest">
              {winner === 'P1' ? player1Name : player2Name} አሸንፏል!
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-12 py-5 rounded-2xl font-black text-2xl transition-all hover:scale-105 shadow-[0_10px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none"
              >
                እንደገና ይጫወቱ
              </button>
              <button 
                onClick={onGoHome}
                className="text-amber-200/60 hover:text-white font-bold transition-colors"
              >
                ወደ መጀመሪያ ገጽ ተመለስ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
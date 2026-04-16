import { useEffect, useState } from 'react';
import GebetaGame from './components/GebetaGame';
import SoundControl from './components/SoundControl';
import UIOverlay from './components/UIOverlay';
import { initAudio, toggleMute, isMuted } from './utils/audio';
import { Home, Users, Monitor, Play, User as UserIcon, ArrowRight, Bot } from 'lucide-react';

type GameMode = 'PvP' | 'PvC';
type View = 'menu' | 'naming' | 'game';

const COMPUTER_NAMES = ['ኮምፒውተር', 'AI-አለም', 'ብልሁ', 'አእምሮ', 'አይ'];

function App() {
  const [muted, setMuted] = useState(isMuted());
  const [view, setView] = useState<View>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('PvC');
  const [player1NameInput, setPlayer1NameInput] = useState('ተጫዋች 1');
  const [player2NameInput, setPlayer2NameInput] = useState('ተጫዋች 2');
  const [gameState, setGameState] = useState({
    player1Name: 'ተጫዋች 1',
    player2Name: 'ኮምፒውተር',
    player1Score: 0,
    player2Score: 0,
    currentPlayer: 1,
    gameOver: false,
    winner: null as string | null
  });

  useEffect(() => {
    initAudio();
  }, []);

  const handleMuteToggle = () => {
    const newMuted = toggleMute();
    setMuted(newMuted);
  };

  const updateGameStats = (stats: any) => {
    setGameState(prev => ({ ...prev, ...stats }));
  };

  const initiateNaming = (mode: GameMode) => {
    setGameMode(mode);
    setPlayer1NameInput('ተጫዋች 1');
    setPlayer2NameInput(mode === 'PvC' ? COMPUTER_NAMES[Math.floor(Math.random() * COMPUTER_NAMES.length)] : 'ተጫዋች 2');
    setView('naming');
  };

  const startGame = () => {
    setGameState({
      player1Name: player1NameInput || 'ተጫዋች 1',
      player2Name: player2NameInput || (gameMode === 'PvC' ? 'ኮምፒውተር' : 'ተጫዋች 2'),
      player1Score: 0,
      player2Score: 0,
      currentPlayer: 1,
      gameOver: false,
      winner: null
    });
    setView('game');
  };

  const handleGoHome = () => {
    setView('menu');
  };

  const restartGame = () => {
    setGameState(prev => ({
      ...prev,
      player1Score: 0,
      player2Score: 0,
      currentPlayer: 1,
      gameOver: false,
      winner: null
    }));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 font-sans text-white select-none overflow-hidden">
      {view === 'menu' && (
        <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <h1 className="text-7xl font-black text-amber-600 drop-shadow-2xl mb-2 tracking-tighter italic">Gebeta/ገበጣ</h1>
            <p className="text-amber-200/60 text-xl italic font-bold tracking-widest">የኢትዮጵያ ባህላዊ ጨዋታ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <button 
              onClick={() => initiateNaming('PvC')}
              className="group relative flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-amber-800/40 to-amber-950/60 border-2 border-amber-700/30 rounded-3xl hover:border-amber-500 hover:scale-105 transition-all shadow-2xl"
            >
              <Monitor className="w-16 h-16 text-amber-500 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="block text-2xl font-bold font-serif">ከኮምፒውተር ጋር</span>
                <span className="text-amber-200/50 text-sm tracking-widest">አይ ጋር አብሮ ለመጫወት</span>
              </div>
            </button>

            <button 
              onClick={() => initiateNaming('PvP')}
              className="group relative flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-amber-800/40 to-amber-950/60 border-2 border-amber-700/30 rounded-3xl hover:border-amber-500 hover:scale-105 transition-all shadow-2xl"
            >
              <Users className="w-16 h-16 text-amber-500 group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <span className="block text-2xl font-bold font-serif">ከሰው ጋር</span>
                <span className="text-amber-200/50 text-sm tracking-widest">ከጓደኛ ጋር ለመጫወት</span>
              </div>
            </button>
          </div>

          <div className="mt-8">
            <SoundControl muted={muted} onToggle={handleMuteToggle} />
          </div>
        </div>
      )}

      {view === 'naming' && (
        <div className="flex flex-col items-center gap-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-10 duration-500 bg-amber-950/40 p-10 rounded-[2.5rem] border-2 border-amber-700/30 backdrop-blur-xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-black text-amber-500 mb-2 font-serif">ስም ያስገቡ</h2>
            <p className="text-amber-200/60">ጨዋታውን ለመጀመር ስምዎን ያስገቡ</p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="text-amber-500 font-bold ml-2 uppercase text-xs tracking-widest">ተጫዋች 1 ስም</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/50" size={20} />
                <input 
                  type="text" 
                  value={player1NameInput}
                  onChange={(e) => setPlayer1NameInput(e.target.value)}
                  className="w-full bg-black/40 border-2 border-amber-700/20 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-white focus:outline-none focus:border-amber-500 transition-all"
                  placeholder="ተጫዋች 1"
                  maxLength={15}
                />
              </div>
            </div>

            {gameMode === 'PvP' ? (
              <div className="flex flex-col gap-2">
                <label className="text-amber-500 font-bold ml-2 uppercase text-xs tracking-widest">ተጫዋች 2 ስም</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/50" size={20} />
                  <input 
                    type="text" 
                    value={player2NameInput}
                    onChange={(e) => setPlayer2NameInput(e.target.value)}
                    className="w-full bg-black/40 border-2 border-amber-700/20 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-white focus:outline-none focus:border-amber-500 transition-all"
                    placeholder="ተጫዋች 2"
                    maxLength={15}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 opacity-60">
                <label className="text-amber-500 font-bold ml-2 uppercase text-xs tracking-widest">ኮምፒውተር (ተቃዋሚ)</label>
                <div className="relative">
                  <Bot className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/50" size={20} />
                  <input 
                    disabled
                    type="text" 
                    value={player2NameInput}
                    className="w-full bg-black/20 border-2 border-amber-900/10 rounded-2xl py-4 pl-12 pr-4 text-xl font-bold text-amber-200/40 cursor-not-allowed"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={startGame}
              className="w-full group bg-amber-500 hover:bg-amber-400 text-amber-950 py-5 rounded-2xl font-black text-2xl transition-all hover:scale-[1.02] shadow-[0_8px_0_rgb(180,83,9)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3"
            >
              ጨዋታውን ጀምር
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={handleGoHome}
              className="text-amber-200/50 hover:text-white font-bold transition-colors text-center"
            >
              ተመለስ
            </button>
          </div>
        </div>
      )}

      {view === 'game' && (
        <>
          <UIOverlay 
            player1Name={gameState.player1Name}
            player2Name={gameState.player2Name}
            player1Score={gameState.player1Score}
            player2Score={gameState.player2Score}
            currentPlayer={gameState.currentPlayer}
            gameOver={gameState.gameOver}
            winner={gameState.winner}
            onGoHome={handleGoHome}
            isPvC={gameMode === 'PvC'}
          />
          
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-[#2c1e14] rounded-2xl shadow-2xl border-8 border-[#3d2b1f] overflow-hidden">
            <GebetaGame onUpdate={updateGameStats} gameMode={gameMode} />
          </div>

          <div className="mt-8 flex gap-4">
            <SoundControl muted={muted} onToggle={handleMuteToggle} />
            <button 
              onClick={handleGoHome}
              className="px-6 py-2 bg-amber-900/40 border border-amber-700/50 hover:bg-amber-800/60 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <Home size={18} />
              ወደ መጀመሪያ ገጽ
            </button>
            <button 
              onClick={() => {
                restartGame();
              }}
              className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-full font-bold transition-colors shadow-lg flex items-center gap-2"
              key={Date.now()}
            >
              <Play size={18} />
              ጨዋታውን እንደገና ጀምር
            </button>
          </div>
        </>
      )}

      <div className="mt-6 text-amber-200/30 text-xs tracking-widest uppercase">
        Ethiopian Gebeta - Traditional Board Game
      </div>
    </div>
  );
}

export default App;
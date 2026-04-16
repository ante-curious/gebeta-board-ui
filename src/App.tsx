import React, { useEffect, useState } from 'react';
import GebetaGame from './components/GebetaGame';
import UIOverlay from './components/UIOverlay';
import { SoundControl } from './components/SoundControl';
import { audioManager } from './utils/audio';

const App: React.FC = () => {
  const [gameData, setGameData] = useState({
    p1Score: 0,
    p2Score: 0,
    currentPlayer: 1,
    isGameOver: false,
    winner: null as number | null
  });

  useEffect(() => {
    // Start background music on first interaction
    const handleFirstInteraction = () => {
      audioManager.playBGM();
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const handleStateChange = (state: any) => {
    setGameData(state);
  };

  return (
    <div className="relative w-full h-screen bg-[#2c1e14] overflow-hidden flex flex-col items-center justify-center font-sans">
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-3xl md:text-4xl font-bold text-[#d4a373] drop-shadow-lg">
          ኢትዮጵያዊ ገበጣ (Ethiopian Gebeta)
        </h1>
      </div>

      <SoundControl />
      
      <div className="relative w-full max-w-5xl aspect-[16/9] md:aspect-[2/1] bg-[#3d2b1f] rounded-3xl shadow-2xl border-8 border-[#1a120b] overflow-hidden">
        <GebetaGame onStateChange={handleStateChange} />
        <UIOverlay {...gameData} />
      </div>

      <div className="mt-6 text-[#a98467] text-sm md:text-base text-center px-4">
        <p>እንዴት እንደሚጫወቱ፡ የራስዎን ጉድጓድ ይምረጡና እንክሎችን ይዝሩ። የመጨረሻው እንክል ባዶ ጉድጓድ ውስጥ ካረፈ ተራዎ ያበቃል።</p>
      </div>
    </div>
  );
};

export default App;
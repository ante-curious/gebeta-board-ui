import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UIOverlayProps {
  p1Score: number;
  p2Score: number;
  currentPlayer: number;
  isGameOver: boolean;
  winner: number | null;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ p1Score, p2Score, currentPlayer, isGameOver, winner }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10">
      {/* Top Player (Player 2) */}
      <div className={`flex justify-between items-center transition-opacity duration-300 ${currentPlayer === 2 ? 'opacity-100' : 'opacity-50'}`}>
        <div className="bg-[#1a120b]/80 p-3 rounded-lg border-2 border-[#d4a373]">
          <h2 className="text-[#d4a373] font-bold text-lg">ተጫዋች 2 (Player 2)</h2>
          <p className="text-white text-2xl">ውጤት: {p2Score}</p>
        </div>
        {currentPlayer === 2 && !isGameOver && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"
          >
            የርስዎ ተራ (Your Turn)
          </motion.div>
        )}
      </div>

      {/* Bottom Player (Player 1) */}
      <div className={`flex justify-between items-center transition-opacity duration-300 ${currentPlayer === 1 ? 'opacity-100' : 'opacity-50'}`}>
        <div className="bg-[#1a120b]/80 p-3 rounded-lg border-2 border-[#d4a373]">
          <h2 className="text-[#d4a373] font-bold text-lg">ተጫዋች 1 (Player 1)</h2>
          <p className="text-white text-2xl">ውጤት: {p1Score}</p>
        </div>
        {currentPlayer === 1 && !isGameOver && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"
          >
            የርስዎ ተራ (Your Turn)
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-auto"
          >
            <div className="bg-[#3d2b1f] p-8 rounded-2xl border-4 border-[#d4a373] text-center shadow-2xl">
              <h2 className="text-4xl font-bold text-[#d4a373] mb-4">ጨዋታው ተጠናቋል!</h2>
              <p className="text-2xl text-white mb-6">
                {winner === 0 ? 'አቻ ወጥታችኋል!' : `አሸናፊ፡ ተጫዋች ${winner}`}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#d4a373] hover:bg-[#b88c60] text-[#1a120b] font-bold py-3 px-8 rounded-lg transition-colors text-xl"
              >
                እንደገና ጀምር
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UIOverlay;
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audio';

export const SoundControl: React.FC = () => {
  const [isMuted, setIsMuted] = useState(audioManager.isMuted());

  const toggleMute = () => {
    const newMuteState = audioManager.toggleMute();
    setIsMuted(newMuteState);
  };

  return (
    <button
      onClick={toggleMute}
      className="absolute top-4 right-4 z-30 p-3 bg-[#1a120b]/80 border-2 border-[#d4a373] rounded-full text-[#d4a373] hover:scale-110 transition-transform"
      aria-label="Toggle Sound"
    >
      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  );
};
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundControlProps {
  muted: boolean;
  onToggle: () => void;
}

const SoundControl: React.FC<SoundControlProps> = ({ muted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all border border-slate-600 shadow-xl"
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        <VolumeX className="text-red-400 w-6 h-6" />
      ) : (
        <Volume2 className="text-green-400 w-6 h-6" />
      )}
    </button>
  );
};

export default SoundControl;
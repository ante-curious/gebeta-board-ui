import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/MainScene';

interface GebetaGameProps {
  onStateChange: (state: any) => void;
}

const GebetaGame: React.FC<GebetaGameProps> = ({ onStateChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 1200,
      height: 600,
      backgroundColor: '#3d2b1f',
      physics: {
        default: 'arcade',
        arcade: { debug: false }
      },
      scene: [new MainScene(onStateChange)],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default GebetaGame;
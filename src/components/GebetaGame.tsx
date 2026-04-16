import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '../game/MainScene';

interface GebetaGameProps {
  onUpdate: (stats: any) => void;
  gameMode: 'PvP' | 'PvC';
}

const GebetaGame: React.FC<GebetaGameProps> = ({ onUpdate, gameMode }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: 1200,
      height: 675,
      transparent: true,
      scene: [new MainScene(onUpdate)],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Phaser.Game(config);

    // Pass data to scene on start
    gameRef.current.events.once('ready', () => {
      const scene = gameRef.current?.scene.getAt(0) as MainScene;
      if (scene) {
        scene.scene.restart({ gameMode });
      }
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [gameMode]);

  return (
    <div 
      ref={gameContainerRef} 
      className="w-full h-full cursor-pointer"
    />
  );
};

export default GebetaGame;
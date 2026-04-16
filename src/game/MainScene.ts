import Phaser from 'phaser';
import { audioManager } from '../utils/audio';

export class MainScene extends Phaser.Scene {
  private pits: Phaser.GameObjects.Container[] = [];
  private seedsData: number[] = Array(12).fill(4); // 2 rows of 6
  private p1Score = 0;
  private p2Score = 0;
  private currentPlayer = 1; // 1 or 2
  private isAnimating = false;
  private onStateChangeCallback: (state: any) => void;

  constructor(onStateChange: (state: any) => void) {
    super('MainScene');
    this.onStateChangeCallback = onStateChange;
  }

  preload() {
    // Generate simple textures
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Pit texture
    graphics.fillStyle(0x1a120b, 1);
    graphics.fillCircle(60, 60, 55);
    graphics.lineStyle(4, 0x8b5e3c, 1);
    graphics.strokeCircle(60, 60, 55);
    graphics.generateTexture('pit', 120, 120);
    graphics.clear();

    // Seed texture
    graphics.fillStyle(0xd4a373, 1);
    graphics.fillCircle(8, 8, 7);
    graphics.lineStyle(1, 0x1a120b, 1);
    graphics.strokeCircle(8, 8, 7);
    graphics.generateTexture('seed', 16, 16);
  }

  create() {
    this.createBoard();
    this.updateUI();
  }

  createBoard() {
    const startX = 200;
    const startYTop = 200;
    const startYBottom = 400;
    const spacing = 160;

    // Player 2 pits (Top row, right to left)
    for (let i = 0; i < 6; i++) {
      const pitIdx = 11 - i;
      const x = startX + i * spacing;
      this.createPit(x, startYTop, pitIdx);
    }

    // Player 1 pits (Bottom row, left to right)
    for (let i = 0; i < 6; i++) {
      const pitIdx = i;
      const x = startX + i * spacing;
      this.createPit(x, startYBottom, pitIdx);
    }
  }

  createPit(x: number, y: number, index: number) {
    const container = this.add.container(x, y);
    const pitSprite = this.add.sprite(0, 0, 'pit').setInteractive({ useHandCursor: true });
    
    container.add(pitSprite);
    
    const countText = this.add.text(0, 70, '4', {
      fontSize: '24px',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    container.add(countText);

    // Initial seeds visualization
    const seedsGroup = this.add.group();
    this.drawSeedsInPit(container, 4);

    pitSprite.on('pointerdown', () => this.handlePitClick(index));
    pitSprite.on('pointerover', () => {
      if (!this.isAnimating && this.isValidPit(index)) {
        pitSprite.setTint(0x555555);
      }
    });
    pitSprite.on('pointerout', () => {
      pitSprite.clearTint();
    });

    this.pits[index] = container;
  }

  drawSeedsInPit(container: Phaser.GameObjects.Container, count: number) {
    // Clear old seeds (except pit sprite and text)
    const toRemove = container.list.filter(obj => obj.type === 'Sprite' && (obj as Phaser.GameObjects.Sprite).texture.key === 'seed');
    toRemove.forEach(obj => container.remove(obj, true));

    // Update text
    const text = container.list.find(obj => obj.type === 'Text') as Phaser.GameObjects.Text;
    if (text) text.setText(count.toString());

    // Draw seeds in a random cluster
    for (let i = 0; i < count; i++) {
      if (i > 15) break; // Limit visual seeds to avoid clutter
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30;
      const sx = Math.cos(angle) * dist;
      const sy = Math.sin(angle) * dist;
      const seed = this.add.sprite(sx, sy, 'seed');
      container.add(seed);
    }
  }

  isValidPit(index: number) {
    if (this.currentPlayer === 1) {
      return index >= 0 && index <= 5 && this.seedsData[index] > 0;
    } else {
      return index >= 6 && index <= 11 && this.seedsData[index] > 0;
    }
  }

  async handlePitClick(index: number) {
    if (this.isAnimating || !this.isValidPit(index)) return;

    this.isAnimating = true;
    audioManager.playClick();

    let seedsToSow = this.seedsData[index];
    this.seedsData[index] = 0;
    this.drawSeedsInPit(this.pits[index], 0);

    let currentIndex = index;
    
    while (seedsToSow > 0) {
      currentIndex = (currentIndex + 1) % 12;
      seedsToSow--;
      
      // Animation step
      await this.animateSeedMove(index, currentIndex);
      
      this.seedsData[currentIndex]++;
      this.drawSeedsInPit(this.pits[currentIndex], this.seedsData[currentIndex]);
      audioManager.playMove();

      // Simple capture rule for this version:
      // If last seed lands in an empty pit on your side, and opposite pit has seeds: capture.
      if (seedsToSow === 0) {
        if (this.isOwnPit(currentIndex) && this.seedsData[currentIndex] === 1) {
          const oppositeIndex = 11 - currentIndex;
          if (this.seedsData[oppositeIndex] > 0) {
            const captured = this.seedsData[oppositeIndex] + 1;
            this.seedsData[currentIndex] = 0;
            this.seedsData[oppositeIndex] = 0;
            
            if (this.currentPlayer === 1) this.p1Score += captured;
            else this.p2Score += captured;

            audioManager.playCapture();
            this.drawSeedsInPit(this.pits[currentIndex], 0);
            this.drawSeedsInPit(this.pits[oppositeIndex], 0);
          }
        }
      }
    }

    this.checkGameOver();
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.isAnimating = false;
    this.updateUI();
  }

  isOwnPit(index: number) {
    if (this.currentPlayer === 1) return index >= 0 && index <= 5;
    return index >= 6 && index <= 11;
  }

  animateSeedMove(fromIdx: number, toIdx: number): Promise<void> {
    return new Promise((resolve) => {
      const fromPit = this.pits[fromIdx];
      const toPit = this.pits[toIdx];
      
      const tempSeed = this.add.sprite(fromPit.x, fromPit.y, 'seed').setDepth(10);
      
      this.tweens.add({
        targets: tempSeed,
        x: toPit.x,
        y: toPit.y,
        duration: 300,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          tempSeed.destroy();
          resolve();
        }
      });
    });
  }

  checkGameOver() {
    const p1Empty = this.seedsData.slice(0, 6).every(s => s === 0);
    const p2Empty = this.seedsData.slice(6, 12).every(s => s === 0);

    if (p1Empty || p2Empty) {
      // Collect remaining seeds
      const remainingP1 = this.seedsData.slice(0, 6).reduce((a, b) => a + b, 0);
      const remainingP2 = this.seedsData.slice(6, 12).reduce((a, b) => a + b, 0);
      
      this.p1Score += remainingP1;
      this.p2Score += remainingP2;
      
      this.seedsData.fill(0);
      this.pits.forEach((_, i) => this.drawSeedsInPit(this.pits[i], 0));

      let winner = 0;
      if (this.p1Score > this.p2Score) winner = 1;
      else if (this.p2Score > this.p1Score) winner = 2;

      this.onStateChangeCallback({
        p1Score: this.p1Score,
        p2Score: this.p2Score,
        currentPlayer: this.currentPlayer,
        isGameOver: true,
        winner
      });
    }
  }

  updateUI() {
    this.onStateChangeCallback({
      p1Score: this.p1Score,
      p2Score: this.p2Score,
      currentPlayer: this.currentPlayer,
      isGameOver: false,
      winner: null
    });
  }
}
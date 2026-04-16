import Phaser from 'phaser';
import { playSFX } from '../utils/audio';

export class MainScene extends Phaser.Scene {
  private holes: Phaser.GameObjects.Container[] = [];
  private seeds: Phaser.GameObjects.Arc[][] = [];
  private boardData: number[] = Array(12).fill(4); // 12 holes, 4 seeds each
  private currentPlayer = 1; // 1 or 2
  private isAnimating = false;
  private gameMode: 'PvP' | 'PvC' = 'PvC';
  private onUpdateCallback: (stats: any) => void;
  private selectionHighlights: Phaser.GameObjects.Graphics[] = [];
  private activeHandMarker: Phaser.GameObjects.Graphics | null = null;

  constructor(onUpdate: (stats: any) => void) {
    super('MainScene');
    this.onUpdateCallback = onUpdate;
  }

  init(data: { gameMode?: 'PvP' | 'PvC' }) {
    if (data.gameMode) this.gameMode = data.gameMode;
  }

  create() {
    const { width, height } = this.scale;
    
    // Create Board Background
    this.createBoard(width, height);

    // Create Holes
    this.createHoles(width, height);

    // Initial Seed Rendering
    this.renderSeeds();

    // Active hand visual (a glowing ring to show where seeds are being dropped)
    this.activeHandMarker = this.add.graphics();
    this.activeHandMarker.lineStyle(4, 0xffffff, 0.8);
    this.activeHandMarker.strokeEllipse(0, 0, 140, 120);
    this.activeHandMarker.setVisible(false);

    this.onUpdateCallback({
      player1Score: 24,
      player2Score: 24,
      currentPlayer: 1,
      gameOver: false
    });

    this.updateStats();
  }

  private createBoard(width: number, height: number) {
    const graphics = this.add.graphics();
    const boardWidth = 1000;
    const boardHeight = 400;
    const x = (width - boardWidth) / 2;
    const y = (height - boardHeight) / 2;

    // Outer chunk
    graphics.fillStyle(0x24170d, 1);
    graphics.fillRoundedRect(x - 10, y - 5, boardWidth + 20, boardHeight + 30, 40);

    // Main board body
    graphics.fillGradientStyle(0x4a3423, 0x4a3423, 0x2c1e14, 0x2c1e14, 1);
    graphics.fillRoundedRect(x, y, boardWidth, boardHeight, 35);

    // Texture
    for (let i = 0; i < 60; i++) {
      const lineY = y + Math.random() * boardHeight;
      const alpha = 0.03 + Math.random() * 0.07;
      graphics.fillStyle(0x000000, alpha);
      graphics.fillRect(x + 20, lineY, boardWidth - 40, 1 + Math.random() * 3);
    }
  }

  private createHoles(width: number, height: number) {
    const boardWidth = 1000;
    const xStart = (width - boardWidth) / 2 + 100;
    const yTop = height / 2 - 80;
    const yBottom = height / 2 + 80;
    const xStep = 160;

    const holeConfigs = [
      ...Array(6).fill(0).map((_, i) => ({ x: xStart + i * xStep, y: yBottom, id: i })),
      ...Array(6).fill(0).map((_, i) => ({ x: xStart + (5 - i) * xStep, y: yTop, id: 6 + i }))
    ];

    holeConfigs.sort((a, b) => a.id - b.id).forEach((config, i) => {
      const container = this.add.container(config.x, config.y);
      const holeGfx = this.add.graphics();
      holeGfx.fillStyle(0x1a0f08, 1);
      holeGfx.fillEllipse(0, 0, 130, 110);
      holeGfx.lineStyle(3, 0x3d2b1f, 0.8);
      holeGfx.strokeEllipse(0, 0, 130, 110);

      const highlight = this.add.graphics();
      highlight.lineStyle(5, 0xfacc15, 0);
      highlight.strokeEllipse(0, 0, 130, 110);
      highlight.setVisible(false);
      this.selectionHighlights[i] = highlight;
      container.add(highlight);

      const hitArea = new Phaser.Geom.Ellipse(0, 0, 130, 110);
      container.setInteractive(hitArea, Phaser.Geom.Ellipse.Contains);

      container.on('pointerover', () => {
        if (this.isAnimating) return;
        if (this.gameMode === 'PvC' && this.currentPlayer === 2) return;
        
        const isPlayersRow = (this.currentPlayer === 1 && i < 6) || (this.currentPlayer === 2 && i >= 6);
        if (isPlayersRow && this.boardData[i] > 0) {
          highlight.clear();
          highlight.lineStyle(5, 0xfacc15, 1);
          highlight.strokeEllipse(0, 0, 130, 110);
          highlight.setVisible(true);
        }
      });

      container.on('pointerout', () => highlight.setVisible(false));
      container.on('pointerdown', () => this.handleMove(i));

      container.addAt(holeGfx, 0);
      this.holes[i] = container;
    });
  }

  private renderSeeds() {
    this.seeds.forEach(row => row.forEach(s => s.destroy()));
    this.seeds = Array(12).fill(0).map(() => []);
    const SEED_COLOR = 0xd9c8b0;

    this.boardData.forEach((count, holeIdx) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 38;
        const seed = this.add.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 10, 0, 360, false, SEED_COLOR);
        seed.setStrokeStyle(1, 0x000000, 0.4);
        this.holes[holeIdx].add(seed);
        this.seeds[holeIdx].push(seed);
      }
    });
  }

  private async handleMove(index: number) {
    if (this.isAnimating) return;
    
    const isPlayer1Row = index < 6;
    if (this.currentPlayer === 1 && !isPlayer1Row) return;
    if (this.currentPlayer === 2 && isPlayer1Row) return;
    if (this.boardData[index] === 0) return;

    this.isAnimating = true;
    this.selectionHighlights.forEach(h => h.setVisible(false));

    await this.executeTurnSequence(index);

    this.checkGameOver();
    if (!this.isAnimating) { // If turn finished
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      this.updateStats();
      
      if (this.gameMode === 'PvC' && this.currentPlayer === 2) {
        this.time.delayedCall(1000, () => this.executeComputerMove());
      }
    }
  }

  private async executeTurnSequence(startIndex: number) {
    let seedsInHand = this.boardData[startIndex];
    this.boardData[startIndex] = 0;
    this.renderSeeds();
    playSFX('click');
    await this.delay(400);

    let currentIdx = startIndex;

    while (seedsInHand > 0) {
      currentIdx = (currentIdx + 1) % 12;
      
      // Visual feedback: Highlight current hole being filled
      this.activeHandMarker?.setVisible(true);
      this.activeHandMarker?.setPosition(this.holes[currentIdx].x, this.holes[currentIdx].y);
      
      seedsInHand--;
      this.boardData[currentIdx]++;
      
      this.renderSeeds();
      playSFX('pop');
      
      // Crucial: Longer delay for "Step by Step" clarity as requested
      await this.delay(500);

      // Gebeta chain reaction logic
      if (seedsInHand === 0 && this.boardData[currentIdx] > 1) {
        // Pause to show the player the landing hole is NOT empty, so we pick up again
        this.activeHandMarker?.lineStyle(4, 0xfacc15, 1);
        await this.delay(600); 
        
        seedsInHand = this.boardData[currentIdx];
        this.boardData[currentIdx] = 0;
        this.renderSeeds();
        playSFX('click');
        
        this.activeHandMarker?.lineStyle(4, 0xffffff, 0.8);
        await this.delay(400);
      }
    }

    this.activeHandMarker?.setVisible(false);
    this.isAnimating = false;
  }

  private executeComputerMove() {
    // Simple AI: Pick a random non-empty hole on top row (6-11)
    const validHoles = [];
    for (let i = 6; i < 12; i++) {
      if (this.boardData[i] > 0) validHoles.push(i);
    }

    if (validHoles.length > 0) {
      const choice = validHoles[Math.floor(Math.random() * validHoles.length)];
      this.handleMove(choice);
    }
  }

  private checkGameOver() {
    const p1Sum = this.boardData.slice(0, 6).reduce((a, b) => a + b, 0);
    const p2Sum = this.boardData.slice(6, 12).reduce((a, b) => a + b, 0);

    if (p1Sum === 0 || p2Sum === 0) {
      const totalP1 = p1Sum + (p1Sum === 0 ? 0 : 0); // Logic varies, but usually game ends when one side empty
      // Simplification: winner is who has more seeds
      const p1Total = this.boardData.slice(0, 6).reduce((a, b) => a + b, 0);
      const p2Total = this.boardData.slice(6, 12).reduce((a, b) => a + b, 0);
      
      this.onUpdateCallback({
        gameOver: true,
        winner: p1Total > p2Total ? 'P1' : 'P2'
      });
    }
  }

  private updateStats() {
    this.onUpdateCallback({
      currentPlayer: this.currentPlayer,
      player1Score: this.boardData.slice(0, 6).reduce((a, b) => a + b, 0),
      player2Score: this.boardData.slice(6, 12).reduce((a, b) => a + b, 0),
    });
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
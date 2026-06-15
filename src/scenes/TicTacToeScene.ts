import Phaser from 'phaser';
import GameState from '../GameState';
import { UI, addPanel, addScreenBackground, createTextButton } from '../ui';

export default class TicTacToeScene extends Phaser.Scene {
  private board: number[] = [];
  private gameOver: boolean = false;
  private playerScore: number = 0;
  private computerScore: number = 0;
  private draws: number = 0;
  private computerThinking: boolean = false;
  private cellGraphics: Phaser.GameObjects.Rectangle[] = [];
  private cellTexts: Phaser.GameObjects.Text[] = [];
  private scoreText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private resetTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('TicTacToe');
  }

  create(): void {
    this.resetSceneObjects();

    const { width, height } = this.cameras.main;

    addScreenBackground(this, 'Tic Tac Toe', 'Take your time. You are X.');

    this.scoreText = this.add.text(width / 2, height * 0.24, this.getScoreLabel(), {
      fontFamily: UI.font,
      fontSize: '20px',
      color: UI.colors.muted,
    }).setOrigin(0.5);

    this.statusText = this.add.text(width / 2, height * 0.29, 'Your turn', {
      fontFamily: UI.font,
      fontSize: '24px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    addPanel(this, width / 2, height / 2, 390, 390, UI.colors.surface);
    this.drawBoard(width, height);
    createTextButton(this, width / 2, height - 92, 240, 64, 'New Game', () => this.resetGame(), {
      fill: UI.colors.coral,
      hoverFill: UI.colors.coralDark,
      fontSize: '20px',
    });
    createTextButton(this, width * 0.15, 48, 100, 44, 'Back', () => {
      GameState.addScore('Tic Tac Toe', this.playerScore);
      this.scene.start('GameSelection');
    }, { fill: UI.colors.headerDark, hoverFill: UI.colors.header, fontSize: '15px' });

    this.resetGame();
  }

  private resetSceneObjects(): void {
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.gameOver = false;
    this.computerThinking = false;
    this.cellGraphics = [];
    this.cellTexts = [];
    this.scoreText = undefined;
    this.statusText = undefined;
    this.resetTimer?.remove(false);
    this.resetTimer = undefined;
  }

  private getScoreLabel(): string {
    return `You: ${this.playerScore} | Computer: ${this.computerScore} | Draws: ${this.draws}`;
  }

  private updateScoreText(): void {
    this.scoreText?.setText(this.getScoreLabel());
  }

  private drawBoard(width: number, height: number): void {
    const boardStartX = width / 2 - 150;
    const boardStartY = height / 2 - 150;
    const cellSize = 100;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        const x = boardStartX + col * cellSize;
        const y = boardStartY + row * cellSize;

        const cell = this.add.rectangle(x + cellSize / 2, y + cellSize / 2, cellSize - 8, cellSize - 8, 0xf7fbfb)
          .setStrokeStyle(2, UI.colors.border)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.handleCellClick(index))
          .on('pointerover', () => {
            if (!this.gameOver && !this.computerThinking && this.board[index] === 0) {
              cell.setFillStyle(0xe9f3f1);
            }
          })
          .on('pointerout', () => {
            if (this.board[index] === 0) {
              cell.setFillStyle(0x333333);
            }
          });

        this.cellGraphics.push(cell);

        const text = this.add.text(x + cellSize / 2, y + cellSize / 2, '', {
          fontFamily: UI.font,
          fontSize: '48px',
          color: UI.colors.text,
          fontStyle: 'bold',
        }).setOrigin(0.5);

        this.cellTexts.push(text);
      }
    }
  }

  private handleCellClick(index: number): void {
    if (this.gameOver || this.computerThinking || this.board[index] !== 0) {
      return;
    }

    this.board[index] = 1;
    this.updateBoard();

    if (this.finishIfGameOver()) {
      return;
    }

    this.computerThinking = true;
    this.statusText?.setText('Computer thinking...');

    this.time.delayedCall(350, () => {
      if (this.gameOver) {
        return;
      }

      const computerMove = this.getComputerMove();
      if (computerMove !== -1) {
        this.board[computerMove] = -1;
        this.updateBoard();
      }

      this.computerThinking = false;
      if (!this.finishIfGameOver()) {
        this.statusText?.setText('Your turn');
      }
    });
  }

  private updateBoard(): void {
    for (let i = 0; i < 9; i++) {
      if (this.board[i] === 1) {
        this.cellTexts[i].setText('X');
        this.cellTexts[i].setColor('#2f8f8a');
        this.cellGraphics[i].setFillStyle(0xd9efeb);
      } else if (this.board[i] === -1) {
        this.cellTexts[i].setText('O');
        this.cellTexts[i].setColor('#d95d63');
        this.cellGraphics[i].setFillStyle(0xf9dfdf);
      } else {
        this.cellTexts[i].setText('');
        this.cellGraphics[i].setFillStyle(0xf7fbfb);
      }
    }
  }

  private finishIfGameOver(): boolean {
    const result = this.checkWinner();
    if (result === null) {
      return false;
    }

    this.gameOver = true;
    this.computerThinking = false;

    if (result === 1) {
      this.playerScore++;
      this.showMessage('You Won!', '#2f8f8a');
    } else if (result === -1) {
      this.computerScore++;
      this.showMessage('Computer Won!', '#d95d63');
    } else {
      this.draws++;
      this.showMessage('Draw!', '#ffff00');
    }

    this.updateScoreText();
    return true;
  }

  private checkWinner(): number | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] !== 0 && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }

    return this.board.every(cell => cell !== 0) ? 0 : null;
  }

  private getComputerMove(): number {
    const winningMove = this.findMoveFor(-1);
    if (winningMove !== -1) {
      return winningMove;
    }

    const blockingMove = this.findMoveFor(1);
    if (blockingMove !== -1) {
      return blockingMove;
    }

    if (this.board[4] === 0) {
      return 4;
    }

    const corners = [0, 2, 6, 8].filter(i => this.board[i] === 0);
    if (corners.length > 0) {
      return Phaser.Utils.Array.GetRandom(corners);
    }

    const available = this.board.map((cell, i) => cell === 0 ? i : -1).filter(i => i !== -1);
    return available.length > 0 ? Phaser.Utils.Array.GetRandom(available) : -1;
  }

  private findMoveFor(player: number): number {
    for (let i = 0; i < 9; i++) {
      if (this.board[i] !== 0) {
        continue;
      }

      this.board[i] = player;
      const wins = this.checkWinner() === player;
      this.board[i] = 0;

      if (wins) {
        return i;
      }
    }

    return -1;
  }

  private resetGame(): void {
    this.resetTimer?.remove(false);
    this.resetTimer = undefined;
    this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.gameOver = false;
    this.computerThinking = false;
    this.statusText?.setText('Your turn');
    this.updateBoard();
  }

  private showMessage(text: string, color: string): void {
    this.statusText?.setText(text);

    const { width, height } = this.cameras.main;
    const message = this.add.text(width / 2, height / 2, text, {
      fontFamily: UI.font,
      fontSize: '48px',
      color,
      fontStyle: 'bold',
      backgroundColor: '#ffffff',
      padding: { x: 20, y: 20 },
    }).setOrigin(0.5);

    this.resetTimer = this.time.delayedCall(1600, () => {
      message.destroy();
      this.resetGame();
    });
  }
}

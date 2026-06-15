import Phaser from 'phaser';
import GameState from '../GameState';
import { UI, addPanel, addScreenBackground, createTextButton } from '../ui';

interface GameScore {
  game: string;
  score: number;
  date: string;
}

type ScoreFilter = 'all' | 'tictactoe' | 'memory';

export default class ScoresScene extends Phaser.Scene {
  private filter: ScoreFilter = 'all';
  private maxScores: number = 12;

  constructor() {
    super('Scores');
  }

  init(data: { filter?: ScoreFilter }): void {
    this.filter = data.filter || 'all';
  }

  create(): void {
    const { width, height } = this.cameras.main;

    addScreenBackground(this, 'High Scores', 'Your best moments so far');

    createTextButton(this, width * 0.15, 48, 100, 44, 'Back', () => this.scene.start('GameSelection'), {
      fill: UI.colors.headerDark,
      hoverFill: UI.colors.header,
      fontSize: '15px',
    });
    this.createFilterButton(width * 0.38, 100, 'All', 'all');
    this.createFilterButton(width * 0.55, 100, 'Tic Tac Toe', 'tictactoe');
    this.createFilterButton(width * 0.74, 100, 'Memory', 'memory');
    createTextButton(this, width * 0.86, height - 70, 160, 50, 'Clear', () => this.clearScores(), {
      fill: UI.colors.red,
      hoverFill: UI.colors.redHover,
      fontSize: '17px',
    });

    this.displayScores(width, height, this.getFilteredScores());
  }

  private createFilterButton(x: number, y: number, label: string, filter: ScoreFilter): void {
    const active = this.filter === filter;
    createTextButton(
      this,
      x,
      y,
      label.length > 8 ? 170 : 120,
      44,
      label,
      () => this.refreshScores(filter),
      {
        fill: active ? UI.colors.yellow : UI.colors.teal,
        hoverFill: active ? UI.colors.yellowHover : UI.colors.tealDark,
        textColor: active ? UI.colors.text : '#ffffff',
        fontSize: '15px',
      }
    );
  }

  private getFilteredScores(): GameScore[] {
    if (this.filter === 'tictactoe') {
      return GameState.getScores('Tic Tac Toe');
    }

    if (this.filter === 'memory') {
      return GameState.getScores('Memory Game');
    }

    return GameState.getScores();
  }

  private displayScores(width: number, height: number, scores: GameScore[]): void {
    const startY = height * 0.18;
    const lineHeight = 58;
    const displayCount = Math.min(this.maxScores, scores.length);

    addPanel(this, width / 2, height * 0.52, width - 70, height * 0.63, UI.colors.surface);

    if (scores.length === 0) {
      this.add.text(width / 2, height / 2, this.getEmptyMessage(), {
        fontFamily: UI.font,
        fontSize: '28px',
        color: UI.colors.text,
      }).setOrigin(0.5);
      return;
    }

    this.add.text(width * 0.1, startY - 40, 'Rank', {
      fontFamily: UI.font,
      fontSize: '18px',
      color: UI.colors.headerDark,
      fontStyle: 'bold',
    });

    this.add.text(width * 0.25, startY - 40, 'Game', {
      fontFamily: UI.font,
      fontSize: '18px',
      color: UI.colors.headerDark,
      fontStyle: 'bold',
    });

    this.add.text(width * 0.55, startY - 40, 'Score', {
      fontFamily: UI.font,
      fontSize: '18px',
      color: UI.colors.headerDark,
      fontStyle: 'bold',
    });

    this.add.text(width * 0.75, startY - 40, 'Date', {
      fontFamily: UI.font,
      fontSize: '18px',
      color: UI.colors.headerDark,
      fontStyle: 'bold',
    });

    for (let i = 0; i < displayCount; i++) {
      const score = scores[i];
      const y = startY + i * lineHeight;
      const bgColor = i % 2 === 0 ? UI.colors.lightCyan : UI.colors.lightCyanAlt;

      this.add.rectangle(width / 2, y + lineHeight / 2, width - 40, lineHeight - 10)
        .setFillStyle(UI.toColorNumber(bgColor))
        .setStrokeStyle(1, UI.toColorNumber(UI.colors.border));

      this.add.text(width * 0.1, y, `#${i + 1}`, {
        fontFamily: UI.font,
        fontSize: '16px',
        color: UI.colors.text,
      });

      this.add.text(width * 0.25, y, score.game, {
        fontFamily: UI.font,
        fontSize: '16px',
        color: '#2f8f8a',
      });

      this.add.text(width * 0.55, y, score.score.toString(), {
        fontFamily: UI.font,
        fontSize: '16px',
        color: '#2f8f8a',
        fontStyle: 'bold',
      });

      this.add.text(width * 0.75, y, score.date, {
        fontFamily: UI.font,
        fontSize: '14px',
        color: UI.colors.muted,
      });
    }

    if (scores.length > this.maxScores) {
      this.add.text(width / 2, startY + displayCount * lineHeight + 40, `${scores.length - displayCount} more scores hidden`, {
        fontFamily: UI.font,
        fontSize: '16px',
        color: UI.colors.muted,
      }).setOrigin(0.5);
    }
  }

  private getEmptyMessage(): string {
    if (this.filter === 'tictactoe') {
      return 'No Tic Tac Toe scores yet.';
    }

    if (this.filter === 'memory') {
      return 'No Memory scores yet.';
    }

    return 'No scores yet. Play a game!';
  }

  private refreshScores(filter: ScoreFilter): void {
    this.scene.restart({ filter });
  }

  private clearScores(): void {
    GameState.clearScores();
    this.scene.restart({ filter: this.filter });
  }
}

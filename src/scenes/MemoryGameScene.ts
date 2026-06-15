import Phaser from 'phaser';
import GameState from '../GameState';
import { UI, addPanel, addScreenBackground, createTextButton } from '../ui';

interface Card {
  index: number;
  value: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default class MemoryGameScene extends Phaser.Scene {
  private static readonly SYMBOLS = [
    '\u{1F31F}',
    '\u{1F3AE}',
    '\u{1F3A8}',
    '\u{1F3AD}',
    '\u{1F3AA}',
    '\u{1F3AF}',
    '\u{1F3B2}',
    '\u{1F3B8}',
  ];

  private cards: Card[] = [];
  private selectedCards: number[] = [];
  private score: number = 0;
  private moves: number = 0;
  private gameOver: boolean = false;
  private cardGraphics: Map<number, Phaser.GameObjects.Rectangle> = new Map();
  private cardTexts: Map<number, Phaser.GameObjects.Text> = new Map();
  private scoreText?: Phaser.GameObjects.Text;
  private canClick: boolean = true;

  constructor() {
    super('MemoryGame');
  }

  create(): void {
    this.resetGame();

    const { width, height } = this.cameras.main;

    addScreenBackground(this, 'Memory Match', 'Find the matching pairs');

    this.scoreText = this.add.text(width / 2, height * 0.24, this.getScoreLabel(), {
      fontFamily: UI.font,
      fontSize: '20px',
      color: UI.colors.muted,
    }).setOrigin(0.5);

    // Initialize cards
    this.initializeCards();

    addPanel(this, width / 2, height / 2, 470, 470, UI.colors.surface);

    // Draw the cards
    this.drawCards(width, height);

    createTextButton(this, width * 0.15, 48, 100, 44, 'Back', () => {
      GameState.addScore('Memory Game', this.score);
      this.scene.start('GameSelection');
    }, { fill: UI.colors.headerDark, hoverFill: UI.colors.header, fontSize: '15px' });
  }

  private resetGame(): void {
    this.cards = [];
    this.selectedCards = [];
    this.score = 0;
    this.moves = 0;
    this.gameOver = false;
    this.cardGraphics.clear();
    this.cardTexts.clear();
    this.scoreText = undefined;
    this.canClick = true;
  }

  private getScoreLabel(): string {
    return `Score: ${this.score} | Moves: ${this.moves}`;
  }

  private updateScoreText(): void {
    this.scoreText?.setText(this.getScoreLabel());
  }

  private initializeCards(): void {
    const values: number[] = [];

    // Create pairs
    MemoryGameScene.SYMBOLS.forEach((_, index) => {
      values.push(index, index);
    });

    // Shuffle
    values.sort(() => Math.random() - 0.5);

    // Create card objects
    for (let i = 0; i < 16; i++) {
      this.cards.push({
        index: i,
        value: values[i],
        isFlipped: false,
        isMatched: false,
      });
    }
  }

  private drawCards(width: number, height: number): void {
    const boardStartX = width / 2 - 200;
    const boardStartY = height / 2 - 200;
    const cellSize = 100;
    let cardIndex = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const x = boardStartX + col * cellSize;
        const y = boardStartY + row * cellSize;
        const index = cardIndex;

        const card = this.add.rectangle(x + cellSize / 2, y + cellSize / 2, cellSize - 12, cellSize - 12)
          .setFillStyle(UI.toColorNumber(UI.colors.teal))
          .setStrokeStyle(2, UI.toColorNumber(UI.colors.headerDark))
          .setInteractive({ useHandCursor: true })
          .setData('isMatched', false)
          .on('pointerdown', () => this.flipCard(index))
          .on('pointerover', function (this: Phaser.GameObjects.Rectangle) {
            if (!this.getData('isMatched')) {
              this.setScale(1.05);
            }
          })
          .on('pointerout', function (this: Phaser.GameObjects.Rectangle) {
            if (!this.getData('isMatched')) {
              this.setScale(1);
            }
          });

        this.cardGraphics.set(index, card);

        const text = this.add.text(x + cellSize / 2, y + cellSize / 2, '?', {
          fontFamily: UI.font,
          fontSize: '48px',
          color: '#fff',
          fontStyle: 'bold',
        }).setOrigin(0.5);

        this.cardTexts.set(index, text);
        cardIndex++;
      }
    }
  }

  private flipCard(index: number): void {
    if (!this.canClick || this.selectedCards.includes(index) || this.cards[index].isMatched || this.gameOver) {
      return;
    }

    const card = this.cards[index];
    const symbol = MemoryGameScene.SYMBOLS[card.value];

    card.isFlipped = true;
    this.cardTexts.get(index)!.setText(symbol);
    this.cardGraphics.get(index)!.setFillStyle(UI.toColorNumber(UI.colors.surfaceSoft));
    this.cardTexts.get(index)!.setColor(UI.colors.text);

    this.selectedCards.push(index);

    if (this.selectedCards.length === 2) {
      this.moves++;
      this.updateScoreText();
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    this.canClick = false;

    const [firstIndex, secondIndex] = this.selectedCards;
    const isMatch = this.cards[firstIndex].value === this.cards[secondIndex].value;

    if (isMatch) {
      this.score += 10;
      this.cards[firstIndex].isMatched = true;
      this.cards[secondIndex].isMatched = true;

      this.cardGraphics.get(firstIndex)!.setFillStyle(UI.toColorNumber(UI.colors.green)).setData('isMatched', true);
      this.cardGraphics.get(secondIndex)!.setFillStyle(UI.toColorNumber(UI.colors.green)).setData('isMatched', true);
      this.cardTexts.get(firstIndex)!.setColor('#ffffff');
      this.cardTexts.get(secondIndex)!.setColor('#ffffff');

      this.selectedCards = [];
      this.canClick = true;
      this.updateScoreText();

      // Check if all cards are matched
      if (this.cards.every(card => card.isMatched)) {
        this.gameOver = true;
        this.showGameOver();
      }
    } else {
      this.time.delayedCall(1000, () => {
        this.cards[firstIndex].isFlipped = false;
        this.cardTexts.get(firstIndex)!.setText('?');
        this.cardTexts.get(firstIndex)!.setColor('#ffffff');
        this.cardGraphics.get(firstIndex)!.setFillStyle(UI.toColorNumber(UI.colors.teal));

        this.cards[secondIndex].isFlipped = false;
        this.cardTexts.get(secondIndex)!.setText('?');
        this.cardTexts.get(secondIndex)!.setColor('#ffffff');
        this.cardGraphics.get(secondIndex)!.setFillStyle(UI.toColorNumber(UI.colors.teal));

        this.selectedCards = [];
        this.canClick = true;
      });
    }
  }

  private showGameOver(): void {
    const { width, height } = this.cameras.main;

    this.add.text(width / 2, height / 2, 'You Won!', {
      fontFamily: UI.font,
      fontSize: '48px',
      color: '#2f8f8a',
      fontStyle: 'bold',
      backgroundColor: '#ffffff',
      padding: { x: 20, y: 20 },
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 80, this.getScoreLabel(), {
      fontFamily: UI.font,
      fontSize: '24px',
      color: UI.colors.text,
      backgroundColor: '#ffffff',
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      GameState.addScore('Memory Game', this.score);
      this.scene.start('GameSelection');
    });
  }
}

import Phaser from 'phaser';
import GameState from '../GameState';
import { UI, addPanel, addScreenBackground, createTextButton } from '../ui';

export default class GameSelectionScene extends Phaser.Scene {
  constructor() {
    super('GameSelection');
  }

  create(): void {
    const { width, height } = this.cameras.main;
    const playerName = GameState.getPlayerName();

    addScreenBackground(this, 'Phaser Games', `Welcome, ${playerName || 'player'}`);

    addPanel(this, width / 2, height * 0.48, 620, 620);
    this.add.text(width / 2, height * 0.25, 'What would you like to play?', {
      fontFamily: UI.font,
      fontSize: '30px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const buttonWidth = 420;
    const buttonHeight = 92;
    const startY = height * 0.34;
    const spacing = 125;

    createTextButton(
      this,
      width / 2,
      startY,
      buttonWidth,
      buttonHeight,
      'Tic Tac Toe',
      () => this.scene.start('TicTacToe'),
      { fill: UI.colors.coral, hoverFill: UI.colors.coralDark, fontSize: '26px' }
    );

    this.add.text(width / 2, startY + 55, 'A quick match against the computer', {
      fontFamily: UI.font,
      fontSize: '17px',
      color: UI.colors.muted,
    }).setOrigin(0.5);

    createTextButton(
      this,
      width / 2,
      startY + spacing,
      buttonWidth,
      buttonHeight,
      'Memory Match',
      () => this.scene.start('MemoryGame'),
      { fill: UI.colors.teal, hoverFill: UI.colors.tealDark, fontSize: '26px' }
    );

    this.add.text(width / 2, startY + spacing + 55, 'Find each pair at your own pace', {
      fontFamily: UI.font,
      fontSize: '17px',
      color: UI.colors.muted,
    }).setOrigin(0.5);

    createTextButton(
      this,
      width / 2,
      startY + spacing * 2,
      buttonWidth,
      buttonHeight,
      'High Scores',
      () => this.scene.start('Scores'),
      { fill: UI.colors.yellow, hoverFill: UI.colors.yellowHover, textColor: '#20313a', fontSize: '26px' }
    );

    createTextButton(
      this,
      width / 2,
      height - 100,
      300,
      58,
      'Change Player',
      () => this.scene.start('NameEntry', { force: true }),
      { fill: UI.colors.headerDark, hoverFill: UI.colors.header, fontSize: '19px' }
    );
  }
}

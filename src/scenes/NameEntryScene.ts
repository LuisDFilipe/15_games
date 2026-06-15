import Phaser from 'phaser';
import GameState from '../GameState';
import { UI, addPanel, addScreenBackground, createTextButton } from '../ui';

export default class NameEntryScene extends Phaser.Scene {
  private inputField?: HTMLInputElement;
  private container?: HTMLDivElement;
  private forceEntry: boolean = false;
  private resizeHandler?: () => void;

  constructor() {
    super('NameEntry');
  }

  init(data: { force?: boolean }): void {
    this.forceEntry = Boolean(data.force);
  }

  create(): void {
    const { width, height } = this.cameras.main;

    const existingName = GameState.getPlayerName();
    if (existingName && !this.forceEntry) {
      this.scene.start('GameSelection');
      return;
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.cleanup());

    addScreenBackground(this, 'Phaser Games', this.forceEntry ? 'Update your player name' : 'Set up your player');
    addPanel(this, width / 2, height * 0.48, 620, 500);

    this.add.text(width / 2, height * 0.33, this.forceEntry ? 'What should we call you?' : 'Welcome. What is your name?', {
      fontFamily: UI.font,
      fontSize: '32px',
      color: UI.colors.text,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.39, 'Scores stay on this device so you can pick up where you left off.', {
      fontFamily: UI.font,
      fontSize: '19px',
      color: UI.colors.muted,
    }).setOrigin(0.5);

    this.createInput(height, existingName);

    createTextButton(this, width / 2, height / 2 + 155, 300, 76, this.forceEntry ? 'Save Name' : 'Start Playing', () => this.handleSubmit(), {
      fill: UI.colors.teal,
      hoverFill: UI.colors.tealDark,
      fontSize: '24px',
    });

    this.inputField?.focus();
    this.resizeHandler = () => this.positionInput(height);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resizeHandler);
  }

  private createInput(gameHeight: number, existingName: string): void {
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.zIndex = '1000';

    this.inputField = document.createElement('input');
    this.inputField.type = 'text';
    this.inputField.placeholder = 'Your name';
    this.inputField.value = this.forceEntry ? existingName : '';
    this.inputField.maxLength = 24;
    this.inputField.style.width = '300px';
    this.inputField.style.padding = '15px';
    this.inputField.style.fontSize = '18px';
    this.inputField.style.borderRadius = '8px';
    this.inputField.style.border = '2px solid #c7d7d8';
    this.inputField.style.backgroundColor = '#ffffff';
    this.inputField.style.color = '#20313a';
    this.inputField.style.textAlign = 'center';
    this.inputField.style.marginBottom = '20px';
    this.inputField.style.display = 'block';
    this.inputField.style.boxShadow = '0 12px 30px rgba(32, 49, 58, 0.12)';

    this.inputField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.handleSubmit();
      }
    });

    this.container.appendChild(this.inputField);
    document.body.appendChild(this.container);
    this.positionInput(gameHeight);
  }

  private positionInput(gameHeight: number): void {
    if (!this.container) {
      return;
    }

    const canvas = this.game.canvas;
    const bounds = canvas.getBoundingClientRect();
    const scaleY = bounds.height / gameHeight;

    this.container.style.left = `${bounds.left + bounds.width / 2}px`;
    this.container.style.top = `${bounds.top + (gameHeight / 2) * scaleY}px`;
    this.container.style.transform = 'translateX(-50%)';
  }

  private handleSubmit(): void {
    const name = this.inputField?.value.trim() || '';
    if (!name) {
      this.inputField?.focus();
      return;
    }

    GameState.setPlayerName(name);
    this.cleanup();
    this.scene.start('GameSelection');
  }

  private cleanup(): void {
    if (this.resizeHandler) {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.resizeHandler);
      this.resizeHandler = undefined;
    }

    if (this.container?.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    this.container = undefined;
    this.inputField = undefined;
  }
}

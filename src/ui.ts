import Phaser from 'phaser';

export const UI = {
  colors: {
    background: 0xf4f8fb,
    header: 0x2f8f8a,
    headerDark: 0x1f5f65,
    surface: 0xffffff,
    surfaceSoft: 0xe9f3f1,
    text: '#20313a',
    muted: '#5f7178',
    border: 0xc7d7d8,
    teal: 0x4bb7a6,
    tealDark: 0x2f8f8a,
    coral: 0xf07167,
    coralDark: 0xc9524a,
    yellow: 0xf6c85f,
    green: 0x63b578,
    red: 0xd95d63,
  },
  font: 'Arial, sans-serif',
};

interface ButtonOptions {
  fill?: number;
  hoverFill?: number;
  textColor?: string;
  fontSize?: string;
}

export function addScreenBackground(scene: Phaser.Scene, title: string, subtitle?: string): void {
  const { width, height } = scene.cameras.main;
  scene.cameras.main.setBackgroundColor(UI.colors.background);

  scene.add.rectangle(width / 2, 0, width, height * 0.2, UI.colors.header).setOrigin(0.5, 0);
  scene.add.rectangle(width / 2, height * 0.2, width, 8, UI.colors.yellow).setOrigin(0.5, 0.5);

  scene.add.text(width / 2, height * 0.065, title, {
    fontFamily: UI.font,
    fontSize: '44px',
    color: '#ffffff',
    fontStyle: 'bold',
  }).setOrigin(0.5);

  if (subtitle) {
    scene.add.text(width / 2, height * 0.125, subtitle, {
      fontFamily: UI.font,
      fontSize: '24px',
      color: '#e7fbf8',
    }).setOrigin(0.5);
  }
}

export function addPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: number = UI.colors.surface
): Phaser.GameObjects.Rectangle {
  return scene.add.rectangle(x, y, width, height, fill)
    .setStrokeStyle(2, UI.colors.border);
}

export function createTextButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  label: string,
  callback: () => void,
  options: ButtonOptions = {}
): Phaser.GameObjects.Container {
  const fill = options.fill ?? UI.colors.teal;
  const hoverFill = options.hoverFill ?? UI.colors.tealDark;
  const textColor = options.textColor ?? '#ffffff';
  const fontSize = options.fontSize ?? '20px';
  const container = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, width, height, fill)
    .setStrokeStyle(2, UI.colors.headerDark);
  const text = scene.add.text(0, 0, label, {
    fontFamily: UI.font,
    fontSize,
    color: textColor,
    fontStyle: 'bold',
  }).setOrigin(0.5);

  container.add([bg, text]);
  container.setSize(width, height);
  container.setInteractive({ useHandCursor: true })
    .on('pointerdown', callback)
    .on('pointerover', () => {
      bg.setFillStyle(hoverFill);
      container.setScale(1.03);
    })
    .on('pointerout', () => {
      bg.setFillStyle(fill);
      container.setScale(1);
    });

  return container;
}

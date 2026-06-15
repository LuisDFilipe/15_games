import Phaser from 'phaser';

export type ColorValue = string | number;

export const UI = {
  colors: {
    background: '#f4f8fb',
    header: '#2f8f8a',
    headerDark: '#1f5f65',
    surface: '#ffffff',
    surfaceSoft: '#e9f3f1',
    text: '#20313a',
    muted: '#5f7178',
    border: '#c7d7d8',
    teal: '#4bb7a6',
    tealDark: '#2f8f8a',
    coral: '#f07167',
    coralDark: '#c9524a',
    yellow: '#f6c85f',
    yellowHover: '#e4b54e',
    green: '#63b578',
    red: '#d95d63',
    redHover: '#b4494f',
    // Additional colors for games
    lightCyan: '#f7fbfb',
    lightCyanAlt: '#eef6f5',
    lightBlue: '#d9efeb',
    lightRed: '#f9dfdf',
    darkText: '#333333',
  },
  font: 'Arial, sans-serif',
  toColorNumber(color: ColorValue): number {
    if (typeof color === 'number') {
      return color;
    }

    return parseInt(color.replace('#', ''), 16);
  },
  toColorString(color: ColorValue): string {
    if (typeof color === 'string') {
      return color;
    }

    return `#${color.toString(16).padStart(6, '0')}`;
  },
};

interface ButtonOptions {
  fill?: ColorValue;
  hoverFill?: ColorValue;
  textColor?: string;
  fontSize?: string;
}

export function addScreenBackground(scene: Phaser.Scene, title: string, subtitle?: string): void {
  const { width, height } = scene.cameras.main;
  scene.cameras.main.setBackgroundColor(UI.toColorNumber(UI.colors.background));

  scene.add.rectangle(width / 2, 0, width, height * 0.2)
    .setFillStyle(UI.toColorNumber(UI.colors.header))
    .setOrigin(0.5, 0);
  scene.add.rectangle(width / 2, height * 0.2, width, 8)
    .setFillStyle(UI.toColorNumber(UI.colors.yellow))
    .setOrigin(0.5, 0.5);

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
  fill: ColorValue = UI.colors.surface
): Phaser.GameObjects.Rectangle {
  return scene.add.rectangle(x, y, width, height)
    .setFillStyle(UI.toColorNumber(fill))
    .setStrokeStyle(2, UI.toColorNumber(UI.colors.border));
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
  const bg = scene.add.rectangle(0, 0, width, height)
    .setFillStyle(UI.toColorNumber(fill))
    .setStrokeStyle(2, UI.toColorNumber(UI.colors.headerDark));
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
      bg.setFillStyle(UI.toColorNumber(hoverFill));
      container.setScale(1.03);
    })
    .on('pointerout', () => {
      bg.setFillStyle(UI.toColorNumber(fill));
      container.setScale(1);
    });

  return container;
}

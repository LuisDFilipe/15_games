import Phaser from 'phaser';
import NameEntryScene from './scenes/NameEntryScene';
import GameSelectionScene from './scenes/GameSelectionScene';
import TicTacToeScene from './scenes/TicTacToeScene';
import MemoryGameScene from './scenes/MemoryGameScene';
import ScoresScene from './scenes/ScoresScene';
import GameState from './GameState';
import { gameSDK } from './sdk';

declare global {
  interface Window {
    gameSDK: typeof gameSDK;
  }
}

// Initialize game state
GameState.init();
window.gameSDK = gameSDK;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1080,
  height: 1920,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    NameEntryScene,
    GameSelectionScene,
    TicTacToeScene,
    MemoryGameScene,
    ScoresScene,
  ],
};

const game = new Phaser.Game(config);

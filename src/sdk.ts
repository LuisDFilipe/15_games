/**
 * Phaser Games App - JavaScript SDK
 * 
 * Use this SDK to interact with the Phaser Games app programmatically
 * for testing, automation, or extending functionality.
 */

interface GameScore {
  game: string;
  score: number;
  date: string;
}

interface GameConfig {
  playerName: string;
  scores: GameScore[];
}

/**
 * Main SDK class for interacting with the Phaser Games App
 */
export class PhaserGamesSDK {
  private storageKey = 'gameState';

  /**
   * Initialize the SDK with the game container
   */
  constructor(private containerId: string = 'game') {}

  /**
   * Get the current player name
   */
  getPlayerName(): string {
    const data = this.getGameState();
    return data?.playerName || '';
  }

  /**
   * Set the player name
   */
  setPlayerName(name: string): void {
    const data = this.getGameState();
    data.playerName = name.trim();
    this.saveGameState(data);
  }

  /**
   * Get all scores or scores for a specific game
   */
  getScores(game?: string): GameScore[] {
    const data = this.getGameState();
    if (game) {
      return data.scores.filter(s => s.game === game);
    }
    return data.scores;
  }

  /**
   * Add a new score
   */
  addScore(game: string, score: number): void {
    if (!Number.isFinite(score)) {
      return;
    }

    const data = this.getGameState();
    const newScore: GameScore = {
      game,
      score: Math.max(0, Math.round(score)),
      date: new Date().toLocaleDateString(),
    };
    data.scores.push(newScore);
    data.scores.sort((a, b) => b.score - a.score);
    if (data.scores.length > 50) {
      data.scores = data.scores.slice(0, 50);
    }
    this.saveGameState(data);
  }

  /**
   * Get high score for a specific game
   */
  getHighScore(game: string): number {
    const scores = this.getScores(game);
    return scores.length > 0 ? scores[0].score : 0;
  }

  /**
   * Get average score for a specific game
   */
  getAverageScore(game: string): number {
    const scores = this.getScores(game);
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, s) => acc + s.score, 0);
    return Math.round(sum / scores.length);
  }

  /**
   * Get statistics for all games
   */
  getStatistics(): {
    [game: string]: {
      count: number;
      highScore: number;
      averageScore: number;
    };
  } {
    const stats: any = {};
    const allScores = this.getScores();
    const games = [...new Set(allScores.map(s => s.game))];

    games.forEach(game => {
      const gameScores = this.getScores(game);
      stats[game] = {
        count: gameScores.length,
        highScore: this.getHighScore(game),
        averageScore: this.getAverageScore(game),
      };
    });

    return stats;
  }

  /**
   * Clear all scores
   */
  clearScores(): void {
    const data = this.getGameState();
    data.scores = [];
    this.saveGameState(data);
  }

  /**
   * Clear all player data
   */
  clearAll(): void {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Export game data as JSON
   */
  exportData(): string {
    const data = this.getGameState();
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import game data from JSON
   */
  importData(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      if (this.isValidGameConfig(data)) {
        this.saveGameState({
          playerName: data.playerName.trim(),
          scores: data.scores,
        });
      } else {
        throw new Error('Invalid game data format');
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  /**
   * Get the game container element
   */
  getContainer(): HTMLElement | null {
    return document.getElementById(this.containerId);
  }

  /**
   * Check if the game is running
   */
  isGameRunning(): boolean {
    const container = this.getContainer();
    return container !== null && container.children.length > 0;
  }

  /**
   * Get full game configuration
   */
  getGameConfig(): GameConfig {
    return this.getGameState();
  }

  /**
   * Set full game configuration
   */
  setGameConfig(config: GameConfig): void {
    if (!this.isValidGameConfig(config)) {
      throw new Error('Invalid game data format');
    }

    this.saveGameState({
      playerName: config.playerName.trim(),
      scores: config.scores,
    });
  }

  /**
   * Private helper: Get game state from localStorage
   */
  private getGameState(): GameConfig {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (this.isValidGameConfig(parsed)) {
          return {
            playerName: parsed.playerName,
            scores: parsed.scores,
          };
        }
      }
    } catch (error) {
      console.error('Error reading game state:', error);
    }
    return {
      playerName: '',
      scores: [],
    };
  }

  /**
   * Private helper: Save game state to localStorage
   */
  private saveGameState(data: GameConfig): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  private isValidGameConfig(data: unknown): data is GameConfig {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const candidate = data as GameConfig;
    return typeof candidate.playerName === 'string'
      && Array.isArray(candidate.scores)
      && candidate.scores.every(score => this.isValidScore(score));
  }

  private isValidScore(score: unknown): score is GameScore {
    if (!score || typeof score !== 'object') {
      return false;
    }

    const candidate = score as GameScore;
    return typeof candidate.game === 'string'
      && Number.isFinite(candidate.score)
      && typeof candidate.date === 'string';
  }
}

// Export singleton instance for convenience
export const gameSDK = new PhaserGamesSDK();

/**
 * Example usage:
 * 
 * // Import the SDK
 * import { PhaserGamesSDK } from './sdk';
 * 
 * // Create or use singleton
 * const sdk = new PhaserGamesSDK();
 * 
 * // Set player name
 * sdk.setPlayerName('John Doe');
 * 
 * // Add a score
 * sdk.addScore('Tic Tac Toe', 100);
 * 
 * // Get high score
 * console.log(sdk.getHighScore('Tic Tac Toe')); // 100
 * 
 * // Get statistics
 * console.log(sdk.getStatistics());
 * 
 * // Export data
 * const backup = sdk.exportData();
 * console.log(backup);
 */

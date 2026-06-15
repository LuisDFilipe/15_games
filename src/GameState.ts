interface GameScore {
  game: string;
  score: number;
  date: string;
}

class GameState {
  private static instance: GameState;
  public playerName: string = '';
  public scores: GameScore[] = [];

  private constructor() {}

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  static init(): void {
    const instance = GameState.getInstance();
    instance.loadFromStorage();
  }

  static setPlayerName(name: string): void {
    const instance = GameState.getInstance();
    instance.playerName = name.trim();
    instance.saveToStorage();
  }

  static getPlayerName(): string {
    return GameState.getInstance().playerName;
  }

  static addScore(game: string, score: number): void {
    if (!Number.isFinite(score)) {
      return;
    }

    const instance = GameState.getInstance();
    const newScore: GameScore = {
      game,
      score: Math.max(0, Math.round(score)),
      date: new Date().toLocaleDateString(),
    };
    instance.scores.push(newScore);
    instance.scores.sort((a, b) => b.score - a.score);
    if (instance.scores.length > 50) {
      instance.scores = instance.scores.slice(0, 50);
    }
    instance.saveToStorage();
  }

  static getScores(game?: string): GameScore[] {
    const instance = GameState.getInstance();
    if (game) {
      return instance.scores.filter(s => s.game === game).map(score => ({ ...score }));
    }
    return instance.scores.map(score => ({ ...score }));
  }

  static clearScores(): void {
    const instance = GameState.getInstance();
    instance.scores = [];
    instance.saveToStorage();
  }

  static getHighScore(game: string): number {
    const scores = GameState.getScores(game);
    return scores.length > 0 ? scores[0].score : 0;
  }

  private saveToStorage(): void {
    try {
      const data = {
        playerName: this.playerName,
        scores: this.scores,
      };
      localStorage.setItem('gameState', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('gameState');
      if (data) {
        const parsed = JSON.parse(data);
        this.playerName = typeof parsed.playerName === 'string' ? parsed.playerName : '';
        this.scores = Array.isArray(parsed.scores)
          ? parsed.scores.filter(GameState.isValidScore)
          : [];
      }
    } catch (error) {
      console.error('Error loading game state:', error);
      this.playerName = '';
      this.scores = [];
    }
  }

  private static isValidScore(score: unknown): score is GameScore {
    if (!score || typeof score !== 'object') {
      return false;
    }

    const candidate = score as GameScore;
    return typeof candidate.game === 'string'
      && Number.isFinite(candidate.score)
      && typeof candidate.date === 'string';
  }
}

export default GameState;

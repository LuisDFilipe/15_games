# Phaser Games App - SDK Documentation

The Phaser Games App includes a complete SDK for programmatically interacting with the game, managing scores, and automating testing.

## Installation

The SDK is built into the app and accessible via localStorage or directly through the JavaScript SDK class.

```typescript
import { PhaserGamesSDK } from './src/sdk';

const sdk = new PhaserGamesSDK();
```

## API Reference

### Player Management

#### `setPlayerName(name: string): void`
Set the player's name.
```typescript
sdk.setPlayerName('John Doe');
```

#### `getPlayerName(): string`
Get the current player's name.
```typescript
const name = sdk.getPlayerName(); // 'John Doe'
```

### Score Management

#### `addScore(game: string, score: number): void`
Add a new score for a game.
```typescript
sdk.addScore('Tic Tac Toe', 150);
sdk.addScore('Memory Game', 850);
```

#### `getScores(game?: string): GameScore[]`
Get all scores or scores for a specific game.
```typescript
// All scores
const allScores = sdk.getScores();

// Scores for specific game
const tictactoeScores = sdk.getScores('Tic Tac Toe');
```

#### `getHighScore(game: string): number`
Get the highest score for a game.
```typescript
const high = sdk.getHighScore('Tic Tac Toe'); // 150
```

#### `getAverageScore(game: string): number`
Get the average score for a game.
```typescript
const avg = sdk.getAverageScore('Tic Tac Toe');
```

### Statistics

#### `getStatistics(): { [game: string]: Statistics }`
Get comprehensive statistics for all games.
```typescript
const stats = sdk.getStatistics();
// {
//   "Tic Tac Toe": {
//     count: 5,
//     highScore: 150,
//     averageScore: 120
//   },
//   "Memory Game": {
//     count: 3,
//     highScore: 850,
//     averageScore: 750
//   }
// }
```

### Data Management

#### `getGameConfig(): GameConfig`
Get the complete game configuration including player name and all scores.
```typescript
const config = sdk.getGameConfig();
```

#### `setGameConfig(config: GameConfig): void`
Set the complete game configuration.
```typescript
sdk.setGameConfig({
  playerName: 'Alice',
  scores: [
    { game: 'Tic Tac Toe', score: 100, date: '6/14/2026' }
  ]
});
```

#### `exportData(): string`
Export all game data as JSON string (for backup).
```typescript
const backup = sdk.exportData();
console.log(backup);
// {"playerName":"John Doe","scores":[...]}
```

#### `importData(jsonString: string): void`
Import game data from JSON string (restore from backup).
```typescript
sdk.importData(backup);
```

#### `clearScores(): void`
Clear all scores while keeping the player name.
```typescript
sdk.clearScores();
```

#### `clearAll(): void`
Clear all player data including name and scores.
```typescript
sdk.clearAll();
```

### Utility Methods

#### `getContainer(): HTMLElement | null`
Get the game container element.
```typescript
const container = sdk.getContainer();
```

#### `isGameRunning(): boolean`
Check if the game is currently running.
```typescript
if (sdk.isGameRunning()) {
  console.log('Game is active');
}
```

## Usage Examples

### Example 1: Initialize and Play
```typescript
import { PhaserGamesSDK } from './src/sdk';

const sdk = new PhaserGamesSDK();

// Set up new player
sdk.setPlayerName('Alice');

// Simulate playing games
sdk.addScore('Tic Tac Toe', 100);
sdk.addScore('Tic Tac Toe', 120);
sdk.addScore('Memory Game', 850);

// Check results
console.log(`${sdk.getPlayerName()} high score in Tic Tac Toe: ${sdk.getHighScore('Tic Tac Toe')}`);
```

### Example 2: Generate Report
```typescript
const sdk = new PhaserGamesSDK();

const stats = sdk.getStatistics();
console.log(`Player: ${sdk.getPlayerName()}`);
console.log('\nGame Statistics:');
Object.entries(stats).forEach(([game, data]) => {
  console.log(`\n${game}:`);
  console.log(`  Games Played: ${data.count}`);
  console.log(`  High Score: ${data.highScore}`);
  console.log(`  Average Score: ${data.averageScore}`);
});
```

### Example 3: Backup and Restore
```typescript
const sdk = new PhaserGamesSDK();

// Create backup
const backup = sdk.exportData();
localStorage.setItem('gameBackup', backup);

// Later, restore from backup
const restoredData = localStorage.getItem('gameBackup');
if (restoredData) {
  sdk.importData(restoredData);
}
```

### Example 4: Testing Automation
```typescript
const sdk = new PhaserGamesSDK();

// Test setup
sdk.clearAll();
sdk.setPlayerName('TestUser');

// Simulate game scores
for (let i = 0; i < 10; i++) {
  sdk.addScore('Tic Tac Toe', Math.floor(Math.random() * 200));
  sdk.addScore('Memory Game', Math.floor(Math.random() * 1000));
}

// Verify
console.log('Test Results:');
console.log(sdk.getStatistics());
```

## Data Structure

```typescript
interface GameScore {
  game: string;
  score: number;
  date: string;
}

interface GameConfig {
  playerName: string;
  scores: GameScore[];
}
```

## Browser Console Access

You can also use the SDK directly from the browser console:

```javascript
// Access the singleton instance
gameSDK.setPlayerName('Test');
gameSDK.addScore('Tic Tac Toe', 100);
console.log(gameSDK.getStatistics());
```

## LocalStorage

The SDK stores data in `localStorage` under the key `gameState`:

```javascript
// Direct localStorage access
const gameState = JSON.parse(localStorage.getItem('gameState'));
console.log(gameState);

// Clear everything
localStorage.removeItem('gameState');
```

## Integration with Mobile Apps

When using Capacitor with Android/iOS, the SDK automatically uses the device's persistent storage:

```typescript
// Same SDK works on mobile via Capacitor
import { PhaserGamesSDK } from './src/sdk';

const sdk = new PhaserGamesSDK();
// Data persists across app restarts
```

## Error Handling

The SDK handles errors gracefully:

```typescript
try {
  sdk.importData(invalidJson);
} catch (error) {
  console.error('Import failed:', error);
}
```

## Performance Notes

- Scores are limited to top 50 (oldest scores are automatically removed)
- Data is stored in browser localStorage (typically 5-10MB limit)
- Operations are synchronous and very fast
- Suitable for client-side use without server backend

## Testing

Example test cases:

```typescript
describe('PhaserGamesSDK', () => {
  let sdk: PhaserGamesSDK;

  beforeEach(() => {
    sdk = new PhaserGamesSDK();
    sdk.clearAll();
  });

  test('should set and get player name', () => {
    sdk.setPlayerName('John');
    expect(sdk.getPlayerName()).toBe('John');
  });

  test('should add and retrieve scores', () => {
    sdk.addScore('Test Game', 100);
    const scores = sdk.getScores('Test Game');
    expect(scores[0].score).toBe(100);
  });

  test('should calculate high score', () => {
    sdk.addScore('Game', 50);
    sdk.addScore('Game', 150);
    expect(sdk.getHighScore('Game')).toBe(150);
  });

  test('should generate statistics', () => {
    sdk.addScore('Game1', 100);
    sdk.addScore('Game2', 200);
    const stats = sdk.getStatistics();
    expect(Object.keys(stats).length).toBe(2);
  });
});
```

## Support

For issues or feature requests, check the main README.md or create an issue in the repository.

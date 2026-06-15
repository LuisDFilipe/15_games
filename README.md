# Phaser Games App - Android

A mobile gaming app built with Phaser.js and Capacitor for Android. Play multiple games, track scores, and compete against AI or challenge your memory!

## Features

- **User Profile**: Enter your name and track your gaming history
- **Tic Tac Toe**: Play classic Tic Tac Toe against an intelligent AI opponent
- **Memory Game**: Test your memory by matching card pairs
- **Score Tracking**: Persistent high score tracking with date and game type
- **Expandable**: Easy to add more games in the future

## Technology Stack

- **Phaser.js 3.60**: Game framework for 2D game development
- **Capacitor**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **Webpack**: Module bundler and dev server

## Project Structure

```
src/
├── index.ts                 # Main entry point
├── index.html              # HTML template
├── GameState.ts            # Global state management
└── scenes/
    ├── NameEntryScene.ts   # User name entry screen
    ├── GameSelectionScene.ts # Game selection menu
    ├── TicTacToeScene.ts   # Tic Tac Toe game with AI
    ├── MemoryGameScene.ts  # Memory card matching game
    └── ScoresScene.ts      # High scores display
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Android SDK (for building Android app)
- Java Development Kit (JDK 11 or higher)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Build the SDK (Windows PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File .\build-sdk.ps1 -Clean
```

4. For development with hot reload:
```bash
npm run dev
```

## Building for Android

### First Time Setup

1. Initialize Capacitor:
```bash
npx cap init
```

2. Add Android platform:
```bash
npx cap add android
```

### Build and Deploy

1. Build the web assets:
```bash
npm run build
```

2. Sync with Capacitor:
```bash
npm run capacitor:sync
```

3. Build for Android:
```bash
npm run capacitor:build
```

4. Open Android Studio:
```bash
npm run android:open
```

5. Build and run the APK from Android Studio, or use:
```bash
npm run capacitor:run
```

## Game Instructions

### Tic Tac Toe
- Tap a cell to place your mark (X)
- Computer automatically places its mark (O)
- First to get 3 in a row wins
- AI uses strategic gameplay

### Memory Game
- Tap cards to reveal symbols
- Match pairs of identical symbols
- Complete the board to win
- Lower move count = higher score
- Score increases by 10 points per match

## Score System

- Scores are automatically saved to local storage
- View all scores or filter by game type
- Scores include date and game name
- Top 50 scores are kept

## Customization

### Adding New Games

1. Create a new scene in `src/scenes/NewGameScene.ts`
2. Extend `Phaser.Scene`
3. Import it in `src/index.ts`
4. Add it to the scene array in the game config
5. Add a button in `GameSelectionScene.ts` to launch it

### Styling

- Colors and sizes can be adjusted in each scene
- Modify `src/index.html` for global styles
- Update `webpack.config.js` to add CSS preprocessing

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run build:dev` - Build development bundle
- `npm run capacitor:sync` - Sync with Capacitor
- `npm run capacitor:build` - Build Android app
- `npm run capacitor:run` - Run on Android device
- `npm run android:open` - Open Android Studio

### Hot Reload

During development, changes to TypeScript files are automatically compiled and reloaded in the browser.

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.

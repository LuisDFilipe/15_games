# Phaser Games App - Project Setup and Development

This is a Phaser.js + Capacitor Android app featuring multiple games with score tracking.

## Project Overview

- **Type**: Mobile Game App (Web-based via Phaser, deployed via Capacitor)
- **Language**: TypeScript
- **Build Tool**: Webpack
- **Target Platform**: Android via Capacitor

## Development Workflow

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- Phaser.js game framework
- Capacitor for mobile deployment
- TypeScript compiler
- Webpack and dev server
- All required loaders and plugins

### Step 2: Run Development Server
```bash
npm run dev
```

This starts a Webpack dev server at `http://localhost:8080` with hot module reloading.

### Step 3: Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Step 4: Android Setup (First Time)
```bash
npx cap init
npx cap add android
```

### Step 5: Deploy to Android
```bash
npm run build
npm run capacitor:sync
npm run capacitor:build
npm run android:open
```

Then build and run from Android Studio.

## Project Structure

```
├── src/
│   ├── index.ts              # Main game initialization
│   ├── index.html            # HTML entry point
│   ├── GameState.ts          # Global state management
│   └── scenes/               # Game scenes
│       ├── NameEntryScene.ts
│       ├── GameSelectionScene.ts
│       ├── TicTacToeScene.ts
│       ├── MemoryGameScene.ts
│       └── ScoresScene.ts
├── dist/                     # Compiled output (generated)
├── capacitor.config.ts       # Capacitor configuration
├── tsconfig.json             # TypeScript configuration
├── webpack.config.js         # Webpack configuration
├── package.json              # Project dependencies
└── README.md                 # User documentation
```

## Key Files

- **GameState.ts**: Manages player name and score persistence using localStorage
- **NameEntryScene.ts**: First screen where users enter their name
- **GameSelectionScene.ts**: Main menu with game options and scores page
- **TicTacToeScene.ts**: Tic Tac Toe game with AI opponent
- **MemoryGameScene.ts**: Memory card matching game
- **ScoresScene.ts**: Display and filter high scores

## Adding New Games

1. Create a new file in `src/scenes/YourGameScene.ts`
2. Extend `Phaser.Scene`
3. Import it in `src/index.ts`
4. Add to scenes array in game config
5. Add button in `GameSelectionScene.ts`
6. Use `GameState.addScore()` to save scores

Example button in GameSelectionScene:
```typescript
this.createGameButton(
  width / 2,
  y,
  280,
  100,
  'Your Game',
  '#color',
  () => this.scene.start('YourScene')
);
```

## Common Tasks

### View game in browser
```bash
npm run dev
# Open http://localhost:8080
```

### Build and test on Android device
```bash
npm run build
npm run capacitor:sync
npx cap run android
```

### Debug on Android
1. Run `npm run dev` or `npm run build`
2. Run `npm run capacitor:sync`
3. Connect Android device via USB
4. Run `npx cap run android`
5. Open Chrome DevTools by going to chrome://inspect

### Clear scores (localStorage)
```javascript
// In browser console
localStorage.removeItem('gameState');
```

## Troubleshooting

### App not updating
- Make sure `npm run build` succeeded
- Run `npm run capacitor:sync` to sync web assets
- Clear browser cache or restart dev server

### Capacitor sync fails
- Ensure `dist/` folder exists: `npm run build`
- Check that Android SDK and Java are installed
- Run `npx cap doctor` to diagnose issues

### Port 8080 already in use
- Kill the process on port 8080
- Or change the port in webpack.config.js

## IDE Setup

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- TypeScript Vue Plugin
- Phaser Extension (optional)
- Android (optional)

### TypeScript Support
- TypeScript support is built-in
- Install `@types/phaser` for type definitions (included)

## Performance Tips

1. Use production builds for testing: `npm run build`
2. Compress assets before deployment
3. Monitor memory usage on Android devices
4. Test on actual devices before release

## Next Steps

1. Start development server: `npm run dev`
2. Open http://localhost:8080 in your browser
3. Try playing the games to understand the structure
4. Add new games by creating new scenes
5. Deploy to Android using Capacitor commands

## Support & Resources

- [Phaser Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Webpack Documentation](https://webpack.js.org/concepts/)

# Up and Down the River Score Tracker - Implementation Plan

## Overview

This document outlines the implementation plan for a web application to track scores for the card game "Up and Down the River." The application will allow users to set up a game, track bids and tricks for each player across rounds, automatically calculate scores based on selected scoring rules, and save game history to local storage.

## Tech Stack

- **Framework**: Remix
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Validation**: arktype
- **Deployment**: Vercel
- **State Persistence**: Local Storage

## Features

1. **Game Setup**
   - Set number of players
   - Enter player names
   - Select scoring rules from predefined options
   - Auto-calculate number of rounds based on player count
   - Customize scoring rules to account for house variations

2. **Score Tracking**
   - Track bids for each player per round
   - Track tricks taken for each player per round
   - Auto-calculate scores based on selected scoring rules
   - Display running totals

3. **Game History**
   - Save all completed games to local storage
   - View history of previous games
   - Resume in-progress games
   - Option to clear all game history

4. **User Experience**
   - Mobile-friendly responsive design
   - Keyboard accessible input forms
   - Clear visual indicators for current round and scores
   - Compatible with Chrome, Firefox, Mobile Chrome, and Mobile Safari

## Data Models

### Player
```typescript
type Player = {
  id: string;
  name: string;
};
```

### Round
```typescript
type Round = {
  number: number;
  cardsPerPlayer: number;
  trumpSuit: string | null;
  playerResults: PlayerRoundResult[];
};
```

### PlayerRoundResult
```typescript
type PlayerRoundResult = {
  playerId: string;
  bid: number;
  tricksTaken: number;
  roundScore: number;
};
```

### ScoringRule
```typescript
type ScoringRuleType = "standard" | "simple" | "common" | "penalty" | "custom";

type ScoringRuleConfig = {
  exactBidBonus: number;
  pointsPerTrick: number;
  pointsForMissingBid: "zero" | "tricksOnly" | "penalty";
  penaltyPerTrick?: number; // Used only when pointsForMissingBid is "penalty"
  name: string;
  description: string;
};

type ScoringRule = {
  type: ScoringRuleType;
  config: ScoringRuleConfig;
};
```

### Game
```typescript
type Game = {
  id: string;
  createdAt: string;
  updatedAt: string;
  players: Player[];
  rounds: Round[];
  scoringRule: ScoringRule;
  isComplete: boolean;
  maxRounds: number;
  currentRound: number;
  winner?: Player;
};
```

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── ui/                          # shadcn components
│   │   ├── game-setup.tsx               # Game setup form
│   │   ├── player-form.tsx              # Player name input
│   │   ├── round-tracker.tsx            # Current round tracking
│   │   ├── bid-input.tsx                # Bid input interface
│   │   ├── tricks-input.tsx             # Tricks taken input
│   │   ├── scoreboard.tsx               # Overall scoreboard
│   │   ├── round-summary.tsx            # Single round summary
│   │   ├── game-history.tsx             # Game history list
│   │   ├── scoring-rules.tsx            # Scoring rule selector
│   │   └── scoring-rule-editor.tsx      # Custom scoring rule editor
│   ├── lib/
│   │   ├── types.ts                     # Type definitions
│   │   ├── validation.ts                # arktype schemas
│   │   ├── scoring.ts                   # Scoring calculation logic
│   │   ├── game-utils.ts                # Game utility functions
│   │   └── storage.ts                   # Local storage utilities
│   ├── routes/
│   │   ├── _index.tsx                   # Home/landing page
│   │   ├── new.tsx                      # New game setup
│   │   ├── games.$gameId.tsx            # Active game view
│   │   ├── games.$gameId.round.$roundId.tsx # Individual round view
│   │   └── history.tsx                  # Game history view
│   ├── styles/
│   │   └── tailwind.css                 # Tailwind imports
│   └── root.tsx                         # Root layout
├── public/
│   ├── favicon.ico
│   └── assets/
├── tailwind.config.js                   # Tailwind configuration
├── tsconfig.json                        # TypeScript configuration
└── package.json                         # Project dependencies
```

## Implementation Phases

### Phase 1: Project Setup & Foundation (1-2 days)

1. **Initialize Remix project**
   ```bash
   npx create-remix@latest up-and-down-river-scorer --template remix-run/remix/templates/remix-ts
   ```

2. **Install dependencies**
   ```bash
   npm install tailwindcss postcss autoprefixer arktype
   npm install -D @types/react @types/react-dom typescript
   ```

3. **Configure TailwindCSS**
   ```bash
   npx tailwindcss init -p
   ```

4. **Set up shadcn/ui**
   ```bash
   npx shadcn-ui@latest init
   ```

5. **Configure project structure**
   - Create folders for components, lib, routes
   - Set up basic layouts and routing

6. **Set up deployment to Vercel**
   - Connect GitHub repository
   - Configure build settings

### Phase 2: Core Game Logic & Data Models (2-3 days)

1. **Define data models with arktype**
   - Create schemas for Player, Round, Game, etc.
   - Implement validation functions

2. **Implement scoring logic**
   - Create functions for all scoring variants
   - Create custom scoring rule configurator
   - Write tests to verify scoring calculations

3. **Develop local storage utilities**
   - Create functions to save/load games
   - Implement data persistence layer
   - Add functionality to clear all saved games

4. **Create game state management**
   - Implement game creation logic
   - Develop round progression utilities
   - Add logic to calculate number of rounds based on player count

### Phase 3: UI Components Development (3-4 days)

1. **Build game setup components**
   - Player number selection
   - Player name input forms
   - Scoring rule selector
   - Custom scoring rule editor

2. **Create round tracking components**
   - Bid input interface
   - Tricks taken input interface
   - Current round display
   - Cards per player indicator

3. **Develop scoreboard components**
   - Overall game scoreboard
   - Round summary view
   - Player ranking display
   - Running total display

4. **Implement game history components**
   - Game history list
   - Game summary view
   - Resume game functionality
   - Clear history option

### Phase 4: Routes & Pages Implementation (2-3 days)

1. **Create home page**
   - New game button
   - Game history access
   - Basic instructions

2. **Implement game setup page**
   - Player setup form
   - Game options configuration
   - Scoring rule customization

3. **Build active game view**
   - Current round tracker
   - Scoreboard
   - Round navigation
   - Game progress indicator

4. **Develop game history page**
   - List of saved games
   - Game summary information
   - Options to resume or delete individual saved games
   - Option to clear all game history

### Phase 5: Testing & Refinement (2-3 days)

1. **Manual testing**
   - Test all user flows
   - Verify calculations for all scoring variants
   - Test persistence and retrieval
   - Test clear functionality

2. **Cross-browser testing**
   - Verify functionality in Chrome and Firefox
   - Test on Mobile Chrome and Mobile Safari
   - Verify responsive design on various screen sizes

3. **Refinements**
   - UI polish
   - Performance optimizations
   - Accessibility improvements
   - Fix any browser-specific issues

### Phase 6: Deployment & Documentation (1 day)

1. **Final deployment to Vercel**
   - Configure production settings
   - Set up domain if needed

2. **Create documentation**
   - Update README with usage instructions
   - Document code for maintainability
   - Add game rules reference

## Scoring Rules Implementation

The app will support multiple scoring variants as specified in the game rules, with the ability to customize:

1. **Standard Scoring**
   - Making Exact Bid: 10 points + 1 point per trick taken
   - Missing Bid: 0 points

2. **Simple Scoring**
   - Making Exact Bid: 10 points + number of tricks bid
   - Missing Bid: 0 points

3. **Common Scoring**
   - All Players: 1 point per trick taken
   - Making Exact Bid: Additional 10 point bonus

4. **Penalty Scoring**
   - Making Exact Bid: 10 points + 1 point per trick taken
   - Missing Bid: -1 point per trick over or under the bid

5. **Custom Scoring**
   - User-defined bonus for making exact bid
   - User-defined points per trick
   - User-defined penalty mechanism for missing bids

The scoring configuration will be implemented with a form that allows users to adjust parameters:

```typescript
function calculateScore(
  bid: number,
  tricksTaken: number,
  scoringRule: ScoringRuleConfig
): number {
  const exactBid = bid === tricksTaken;

  if (exactBid) {
    return scoringRule.exactBidBonus + (tricksTaken * scoringRule.pointsPerTrick);
  }

  switch (scoringRule.pointsForMissingBid) {
    case "zero":
      return 0;
    case "tricksOnly":
      return tricksTaken * scoringRule.pointsPerTrick;
    case "penalty":
      const difference = Math.abs(bid - tricksTaken);
      return -difference * (scoringRule.penaltyPerTrick || 1);
    default:
      return 0;
  }
}
```

## Local Storage Implementation

The application will use the browser's localStorage API to persist game data. The storage structure will be:

```typescript
// Current active game
localStorage.setItem('currentGame', JSON.stringify(gameData));

// Game history - array of all completed and in-progress games
localStorage.setItem('gameHistory', JSON.stringify(gameHistoryArray));

// User preferences including custom scoring rules
localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
```

For larger games, we'll implement a chunking mechanism to avoid exceeding localStorage limits.

A utility function will be provided to clear all game data:

```typescript
function clearAllGameData() {
  localStorage.removeItem('currentGame');
  localStorage.removeItem('gameHistory');
  // Optionally keep user preferences
}
```

## Round Calculation

The app will automatically calculate the recommended number of rounds based on the number of players:

```typescript
function calculateGameStructure(playerCount: number): {
  maxCardsPerPlayer: number;
  totalRounds: number;
  roundsStructure: number[];
} {
  let maxCardsPerPlayer: number;

  // Determine maximum cards per player based on player count
  if (playerCount <= 5) {
    maxCardsPerPlayer = 10;
  } else if (playerCount === 6) {
    maxCardsPerPlayer = 8;
  } else {
    maxCardsPerPlayer = 7;
  }

  // Calculate descending and ascending rounds
  const descendingRounds = Array.from(
    { length: maxCardsPerPlayer },
    (_, i) => maxCardsPerPlayer - i
  );

  const ascendingRounds = Array.from(
    { length: maxCardsPerPlayer - 1 },
    (_, i) => i + 2
  );

  const roundsStructure = [...descendingRounds, 1, ...ascendingRounds];

  return {
    maxCardsPerPlayer,
    totalRounds: roundsStructure.length,
    roundsStructure
  };
}
```

## Game Flow

1. User creates new game:
   - Selects number of players
   - Enters player names
   - Chooses scoring rules (predefined or custom)
   - App calculates total rounds

2. For each round:
   - App shows current round number and cards per player
   - User enters bids for each player
   - User enters tricks taken for each player
   - App calculates and displays scores

3. After final round:
   - App displays final scores and winner
   - Game is saved to history
   - User can start a new game or review history

## Browser Compatibility

The application will be tested to ensure proper functionality on:
- Latest versions of Chrome
- Latest versions of Firefox
- Mobile Chrome on Android
- Mobile Safari on iOS

This will be achieved by:
- Using modern JavaScript features with appropriate polyfills
- Testing responsive layouts on various screen sizes
- Using browser-agnostic storage APIs
- Ensuring touch-friendly UI for mobile browsers

## Potential Enhancements (Future Versions)

1. **Offline Support**
   - Implement PWA capabilities for full offline functionality

2. **Statistics Dashboard**
   - Add player statistics across multiple games

3. **Export/Import Game Data**
   - Allow users to backup and restore their game history

4. **Multiplayer Support**
   - Real-time score tracking across multiple devices

5. **Card Dealing Simulator**
   - Visual representation of cards dealt to add atmosphere

## Timeline

Estimated total development time: **10-15 days**

- Phase 1: 1-2 days
- Phase 2: 2-3 days
- Phase 3: 3-4 days
- Phase 4: 2-3 days
- Phase 5: 2-3 days
- Phase 6: 1 day

## Conclusion

This implementation plan provides a comprehensive roadmap for building the "Up and Down the River" score tracker application. The application will be built using modern web technologies, with a focus on user experience and reliability. The modular approach allows for incremental development and testing, with clear milestones for tracking progress.

With the ability to customize scoring rules, save multiple games, and clear history as needed, this application will serve as a versatile and useful tool for card game enthusiasts. The automatic calculation of rounds based on player count will simplify the setup process, and browser compatibility across major platforms will ensure wide usability.

# Up and Down the River Score Tracker - Version 1.5 Specification

## Overview

Version 1.5 introduces three key enhancements to improve the user experience and add flexibility to the game:

1. **Round Pattern Selection**: Allow users to choose the pattern of the rounds (down-up or up-down).
2. **Game Resumption Logic Fix**: Ensure the game correctly resumes at the proper phase.
3. **Scoreboard Winner Star**: Modify the scoreboard to show a star next to the current winning player.

These changes will enhance the flexibility, reliability, and clarity of the game, addressing user feedback and improving the overall experience.

## 1. Round Pattern Selection

### Description

Currently, the game only supports a "down-up" pattern where the game starts with the maximum number of cards and decreases to 1 card before going back up to the maximum. This update will add an option for an "up-down" pattern where the game starts with 1 card, increases to the maximum card count (appearing twice), and then goes back down to 1.

### Implementation Details

#### 1.1 Add Round Pattern Type

Add a new type to `app/lib/types.ts`:

```typescript
/**
 * Round pattern for game structure
 */
export type RoundPattern = 'down-up' | 'up-down';

// Update the Game type to include the round pattern
export type Game = {
  // existing properties
  roundPattern: RoundPattern;
};
```

#### 1.2 Update Game Structure Calculation

Modify the `calculateGameStructure` function in `app/lib/game-utils.ts` to accept a pattern parameter:

```typescript
export function calculateGameStructure(
  playerCount: number,
  customMaxCards?: number,
  roundPattern: RoundPattern = 'down-up'
): {
  maxCardsPerPlayer: number;
  totalRounds: number;
  roundsStructure: number[];
} {
  // existing code to determine max cards

  // Calculate round structures based on pattern
  let roundsStructure: number[];
  if (roundPattern === 'down-up') {
    // Down-Up: Max -> 1 -> Max
    roundsStructure = [...descendingRounds, 1, ...ascendingRounds];
  } else {
    // Up-Down: 1 -> Max -> Max -> 1
    // Include max cards twice - once when going up and once when going down
    roundsStructure = [
      1,
      ...Array.from({ length: maxCardsPerPlayer - 1 }, (_, i) => i + 2),
      maxCardsPerPlayer, // Add max card again to ensure it appears twice
      ...Array.from({ length: maxCardsPerPlayer - 1 }, (_, i) => maxCardsPerPlayer - i - 1)
    ];
  }

  return {
    maxCardsPerPlayer,
    totalRounds: roundsStructure.length,
    roundsStructure,
  };
}
```

#### 1.3 Update Game Creation

Update the `createGame` function to accept and store the round pattern:

```typescript
export function createGame(
  players: Player[],
  scoringRuleType: string,
  customMaxCards?: number,
  roundPattern: RoundPattern = 'down-up'
): Game {
  // Existing code

  return {
    // Existing properties
    roundPattern,
  };
}
```

#### 1.4 Add Round Pattern Selection to Game Setup

Update the Game Setup component (`app/components/game-setup.tsx`) to allow selection of the round pattern:

```tsx
// Add state for round pattern
const [roundPattern, setRoundPattern] = React.useState<RoundPattern>('down-up');

// Add selection UI
<div className="space-y-2">
  <Label htmlFor="round-pattern">Round Pattern</Label>
  <Select value={roundPattern} onValueChange={handleRoundPatternChange}>
    <SelectTrigger id="round-pattern">
      <SelectValue placeholder="Select round pattern" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="down-up">
        Down-Up (Start at max cards, go down to 1, then back up)
      </SelectItem>
      <SelectItem value="up-down">
        Up-Down (Start at 1 card, go up to max, then back down)
      </SelectItem>
    </SelectContent>
  </Select>
</div>
```

#### 1.5 Update Round Tracker Component

Update the RoundTracker component to use the game's round pattern:

```tsx
export const RoundTracker: React.FC<RoundTrackerProps> = ({ game, currentRound }) => {
  const { roundsStructure } = calculateGameStructure(
    game.players.length,
    game.customMaxCards,
    game.roundPattern
  );

  // Rest of the component
};
```

#### 1.6 Visual Design

When displaying the round pattern in the UI, use clear labels:

- "Down-Up" for the pattern starting with max cards
- "Up-Down" for the pattern starting with 1 card

Include a visualization of the round structure in the game setup screen to help users understand the pattern they've selected.

### Testing Plan

1. Verify the game correctly calculates the round structure for both patterns
2. Test that the pattern selection is saved with the game
3. Ensure the round tracker correctly displays the rounds based on the selected pattern
4. Verify that all existing game logic works correctly with both patterns

## 2. Game Resumption Logic Fix

### Current Issue

When resuming a game, the app does not correctly remember which phase the player was in (trump selection, bidding, or tricks) and always shows the tricks section for the current round, even if bids have not been entered yet.

### Root Cause Analysis

The issue is in the `loadGame()` function in `app/routes/games.$gameId.tsx`. When determining which phase to show, it correctly checks if the trump has been selected, but it doesn't properly handle the bidding phase detection.

The current code initializes player bids to `0` when creating a new round, which makes it difficult to distinguish between a bid that has been deliberately set to 0 and a bid that hasn't been entered yet:

```typescript
playerResults: game.players.map((player) => ({
  playerId: player.id,
  bid: 0,           // This initialization makes it hard to detect if bids have been entered
  tricksTaken: 0,
  roundScore: 0,
})),
```

The resumption code then uses this check, which doesn't work correctly:

```typescript
const bidComplete = roundData.playerResults.every((p) => p.bid >= 0);
setBidPhase(!bidComplete);
```

Since all bids start at 0 and 0 >= 0 is true, this will always think bids are complete.

### Implementation Details

#### 2.1 Update Bid Initialization

First, modify `app/lib/types.ts` to allow for `null` bid values to indicate bids that haven't been entered yet:

```typescript
export type PlayerRoundResult = {
  playerId: string;
  bid: number | null;
  tricksTaken: number;
  roundScore: number;
};
```

Then update the `createRound()` function in `app/lib/game-utils.ts` to initialize bids to `null`:

```typescript
playerResults: game.players.map((player) => ({
  playerId: player.id,
  bid: null,  // Initialize to null instead of 0
  tricksTaken: 0,
  roundScore: 0,
})),
```

#### 2.2 Update Bid Completion Check

Modify the `allPlayersBidded()` function in `app/lib/game-utils.ts` to check for non-null values:

```typescript
export function allPlayersBidded(round: Round): boolean {
  return round.playerResults.every((result) => result.bid !== null);
}
```

#### 2.3 Fix Game Resumption Logic

Update the `loadGame()` function in `app/routes/games.$gameId.tsx` to correctly determine the game phase:

```typescript
// Get current round
const roundData = gameData.rounds.find((r) => r.number === gameData.currentRound);

if (roundData) {
  setCurrentRound(roundData);

  // Determine if we're in trump selection, bid, or tricks phase
  if (roundData.trumpSuit === null) {
    // If no trump suit is selected, we're in trump selection phase
    setTrumpSelectionPhase(true);
    setBidPhase(false);
  } else {
    // Trump has been selected, we're past the trump selection phase
    setTrumpSelectionPhase(false);

    // Check if any player has a null bid (indicating bid not yet entered)
    const biddingIncomplete = roundData.playerResults.some((p) => p.bid === null);
    setBidPhase(biddingIncomplete);

    // If we're not in bidding phase and not in trump selection,
    // we must be in the tricks phase (which is the default)
  }
}
```

#### 2.4 Update BidInput Component

Update the `app/components/bid-input.tsx` component to handle null bid values:

```typescript
const initialBids = round.playerResults.reduce<Record<string, number | null>>((acc, result) => {
  acc[result.playerId] = result.bid;  // No need for || null since bid can already be null
  return acc;
}, {});
```

And when saving bids:

```typescript
const updatedRound = {
  ...round,
  playerResults: round.playerResults.map((result) => ({
    ...result,
    bid: bids[result.playerId] ?? 0,  // Convert null to 0 when saving
  })),
};
```

#### 2.5 Update Validation Logic

When a user is saving bids, update the validation to ensure all players have a non-null bid:

```typescript
// Validate all players have submitted bids
const hasAllBids = players.every((player) => bids[player.id] !== null && bids[player.id] !== undefined);
if (!hasAllBids) {
  setValidationError('All players must submit bids');
  return;
}
```

## 3. Scoreboard Winner Star Logic

### Current Issue

The scoreboard shows a star next to the player with the highest score, but it has two issues:

1. It shows a star even when all players have zero points (at game start)
2. It doesn't show stars for all players in case of a tie for first place

### Implementation Details

#### 3.1 Update Star Logic

Modify the `Scoreboard` component in `app/components/scoreboard.tsx` to handle these cases:

```typescript
export const Scoreboard: React.FC<ScoreboardProps> = ({ game }) => {
  const { players, rounds } = game;

  // Calculate player scores and sort by total score (highest first)
  const playerScores = players
    .map((player) => {
      const playerResults = rounds.flatMap((round) =>
        round.playerResults.filter((result) => result.playerId === player.id),
      );

      const totalScore = calculateTotalScore(playerResults);

      return {
        player,
        results: playerResults,
        totalScore,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  // Find the highest score
  const highestScore = playerScores.length > 0 ? playerScores[0].totalScore : 0;

  // Don't show stars if all players have zero points
  const shouldShowStars = highestScore > 0;

  // Determine leading players (could be multiple in case of a tie)
  const leadingPlayerIds = shouldShowStars
    ? playerScores.filter(p => p.totalScore === highestScore).map(p => p.player.id)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scoreboard</CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <table className="w-full text-xs sm:text-sm">
          <TableHeader>
            {/* ... existing header ... */}
          </TableHeader>
          <TableBody>
            {playerScores.map(({ player, totalScore }) => (
              <TableRow key={player.id} className="border-b last:border-0">
                <TableCell className="py-1 sm:py-2 px-2 sm:pr-4 font-medium whitespace-nowrap">
                  {player.name}
                  {leadingPlayerIds.includes(player.id) && (
                    <span className="ml-1 text-xs text-amber-500" title="Current leader">
                      ★
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">{totalScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>

        {game.isComplete && shouldShowStars && (
          <div className="mt-4 text-center font-medium">
            Winner: {playerScores[0].player.name}
            <span className="ml-1 text-amber-500">★</span>!
          </div>
        )}

        {game.isComplete && !shouldShowStars && (
          <div className="mt-4 text-center font-medium">
            Game complete! All players tied with 0 points.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

#### 3.2 Key Changes

1. **No stars when all scores are zero**: The component now checks if the highest score is greater than 0 before showing any stars.
2. **Support for ties**: The component now identifies all players with the highest score and shows stars next to all of them.
3. **Different end-game message**: When a game completes with all players at 0 points, it shows a special message indicating a tie.
4. **Clearer round number labels**: Round numbers in the scoreboard header now have a "Rd." prefix for better clarity.

### Testing Plan

1. Verify no stars are shown at game start when all players have zero points
2. Create a game with one clear leader and verify only they have a star
3. Create a game with two players tied for the lead and verify both have stars
4. Test the completed game message when all players end with 0 points
5. Verify that round numbers are displayed with the "Rd." prefix

## Implementation Considerations

- **Backward Compatibility**: Existing saved games will need a default `roundPattern` value of 'down-up'
- **Data Migration**: Add a migration function to add the `roundPattern` field to existing saved games
- **UI Changes**: The game setup screen will need careful layout adjustments to accommodate the new option
- **Testing**: Extensive testing of all game-phase transitions is crucial

## Timeline

- Development: 2-3 days
- Testing: 1 day
- Documentation updates: 0.5 day
- Total: 3-4.5 days

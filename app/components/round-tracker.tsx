import type * as React from 'react';
import { isRoundComplete } from '~/lib/game-utils';
import type { Game, Round } from '~/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type RoundTrackerProps = {
	game: Game;
	currentRound: Round;
};

// Helper function to format trump suit for display
function formatTrumpSuit(suit: string | null): React.ReactNode {
	if (!suit) return 'No Trump';

	const suitSymbols: Record<string, { symbol: string; color: string }> = {
		hearts: { symbol: '♥', color: 'text-red-500' },
		diamonds: { symbol: '♦', color: 'text-red-500' },
		clubs: { symbol: '♣', color: 'text-black' },
		spades: { symbol: '♠', color: 'text-black' },
	};

	const suitInfo = suitSymbols[suit.toLowerCase()];
	if (!suitInfo) return suit.charAt(0).toUpperCase() + suit.slice(1);

	return (
		<span>
			{suit.charAt(0).toUpperCase() + suit.slice(1)}{' '}
			<span className={suitInfo.color}>{suitInfo.symbol}</span>
		</span>
	);
}

// Helper function to calculate game structure
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
		(_, i) => maxCardsPerPlayer - i,
	);

	const ascendingRounds = Array.from({ length: maxCardsPerPlayer - 1 }, (_, i) => i + 2);

	const roundsStructure = [...descendingRounds, 1, ...ascendingRounds];

	return {
		maxCardsPerPlayer,
		totalRounds: roundsStructure.length,
		roundsStructure,
	};
}

export const RoundTracker: React.FC<RoundTrackerProps> = ({ game, currentRound }) => {
	const { roundsStructure } = calculateGameStructure(game.players.length);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle>Round {currentRound.number}</CardTitle>
				<CardDescription>
					{currentRound.cardsPerPlayer} card
					{currentRound.cardsPerPlayer !== 1 ? 's' : ''} per player
					{currentRound.trumpSuit && ' • Trump: '}
					{currentRound.trumpSuit && formatTrumpSuit(currentRound.trumpSuit)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex space-x-1 overflow-x-auto pb-1">
					{roundsStructure.map((cards, index) => {
						const roundNumber = index + 1;
						const isCurrentRound = roundNumber === currentRound.number;
						const isPastRound = game.rounds.some(
							(r) => r.number === roundNumber && isRoundComplete(r),
						);

						return (
							<div
								key={roundNumber}
								className={`
                  flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs
                  ${isCurrentRound ? 'bg-primary text-primary-foreground' : ''}
                  ${isPastRound ? 'bg-muted line-through' : ''}
                  ${!isCurrentRound && !isPastRound ? 'bg-muted/40' : ''}
                `}
								title={`Round ${roundNumber}: ${cards} cards`}
							>
								{cards}
							</div>
						);
					})}
				</div>
				<div className="text-sm text-muted-foreground mt-2">
					Progress: {game.rounds.filter(isRoundComplete).length} / {game.maxRounds} rounds complete
				</div>
			</CardContent>
		</Card>
	);
};

import type * as React from 'react';
import { calculateGameStructure, isRoundComplete } from '~/lib/game-utils';
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

export const RoundTracker: React.FC<RoundTrackerProps> = ({ game, currentRound }) => {
	// Use the game's customMaxCards value directly if it exists
	const { roundsStructure } = calculateGameStructure(game.players.length, game.customMaxCards);

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle>Round {currentRound.number}</CardTitle>
				<CardDescription>
					{currentRound.cardsPerPlayer} {currentRound.cardsPerPlayer === 1 ? 'card' : 'cards'}
					{currentRound.trumpSuit && <> • Trump: {formatTrumpSuit(currentRound.trumpSuit)}</>}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-1.5">
					{roundsStructure.map((cards, index) => {
						const roundNumber = index + 1;
						const isPastRound = roundNumber < currentRound.number;
						const isCurrentRound = roundNumber === currentRound.number;

						return (
							<div
								key={roundNumber}
								className={`
                  flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center text-xs
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
				<div className="text-xs sm:text-sm text-muted-foreground mt-2">
					Progress: {game.rounds.filter(isRoundComplete).length} / {game.maxRounds} rounds complete
				</div>
			</CardContent>
		</Card>
	);
};

import * as React from 'react';
import { calculateRoundScore, madeBidExactly } from '~/lib/scoring';
import type { Player, Round, ScoringRuleConfig } from '~/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

type TricksInputProps = {
	players: Player[];
	round: Round;
	scoringRuleConfig: ScoringRuleConfig;
	onSave: (updatedRound: Round) => void;
};

export const TricksInput: React.FC<TricksInputProps> = ({
	players,
	round,
	scoringRuleConfig,
	onSave,
}) => {
	const initialTricks = round.playerResults.reduce<Record<string, number>>((acc, result) => {
		acc[result.playerId] = result.tricksTaken;
		return acc;
	}, {});

	const [tricks, setTricks] = React.useState<Record<string, number>>(initialTricks);
	const [validationError, setValidationError] = React.useState<string | null>(null);
	const [scores, setScores] = React.useState<Record<string, number>>({});

	// Update scores when tricks or scoring rule changes
	React.useEffect(() => {
		const newScores: Record<string, number> = {};

		for (const result of round.playerResults) {
			const tricksTaken = tricks[result.playerId] || 0;
			newScores[result.playerId] = calculateRoundScore(result.bid, tricksTaken, scoringRuleConfig);
		}

		setScores(newScores);
	}, [tricks, round.playerResults, scoringRuleConfig]);

	function handleTricksChange(playerId: string, tricksValue: string): void {
		const tricksNumber = Number.parseInt(tricksValue, 10);

		// Allow empty input (reset to empty string)
		if (tricksValue === '') {
			setTricks((prev) => ({ ...prev, [playerId]: 0 }));
			setValidationError(null);
			return;
		}

		// Validate input is a number
		if (Number.isNaN(tricksNumber)) {
			return;
		}

		// Validate tricks is not negative
		if (tricksNumber < 0) {
			setValidationError('Tricks cannot be negative');
			return;
		}

		// Validate tricks does not exceed cards per player
		if (tricksNumber > round.cardsPerPlayer) {
			setValidationError(`Tricks cannot exceed ${round.cardsPerPlayer} cards`);
			return;
		}

		// Clear validation error if any
		setValidationError(null);

		// Update tricks
		setTricks((prev) => ({ ...prev, [playerId]: tricksNumber }));
	}

	function handleSave(): void {
		// Validate all players have submitted tricks
		const hasAllTricks = players.every((player) => tricks[player.id] !== undefined);
		if (!hasAllTricks) {
			setValidationError('All players must enter tricks taken');
			return;
		}

		// Validate total tricks equals cards per player
		const totalTricks = Object.values(tricks).reduce((sum, trick) => sum + trick, 0);
		if (totalTricks !== round.cardsPerPlayer) {
			setValidationError(`Total tricks must equal ${round.cardsPerPlayer}`);
			return;
		}

		// Update round with new tricks and scores
		const updatedRound = {
			...round,
			playerResults: round.playerResults.map((result) => ({
				...result,
				tricksTaken: tricks[result.playerId] || 0,
				roundScore: scores[result.playerId] || 0,
			})),
		};

		onSave(updatedRound);
	}

	// Calculate total tricks
	const totalTricks = Object.values(tricks).reduce((sum, trick) => sum + trick, 0);
	const isValid = totalTricks === round.cardsPerPlayer;

	// Format trump suit for display
	const formatTrumpSuit = (suit: string | null): React.ReactNode => {
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
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Enter Tricks Taken</CardTitle>
				<CardDescription>
					Round {round.number} • {round.cardsPerPlayer} cards per player • Trump:{' '}
					{formatTrumpSuit(round.trumpSuit)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{round.playerResults.map((result) => {
						const player = players.find((p) => p.id === result.playerId);
						if (!player) return null;

						const bid = result.bid;
						const tricksTaken = tricks[result.playerId] || 0;
						const madeBid = madeBidExactly(bid, tricksTaken);

						return (
							<div key={player.id} className="flex items-center gap-2">
								<Label htmlFor={`tricks-${player.id}`} className="w-32">
									{player.name}
								</Label>
								<div className="flex items-center gap-2">
									<Input
										id={`tricks-${player.id}`}
										type="number"
										min={0}
										max={round.cardsPerPlayer}
										value={tricks[player.id] ?? ''}
										onChange={(e) => handleTricksChange(player.id, e.target.value)}
										className="w-20"
									/>
									<div className="text-sm w-24">
										<div className="text-muted-foreground">Bid: {bid}</div>
										<div className={madeBid ? 'text-green-600' : 'text-destructive'}>
											Score: {scores[player.id] || 0}
										</div>
									</div>
								</div>
							</div>
						);
					})}

					<div className="flex items-center justify-between pt-2 text-sm font-medium">
						<div>Total Tricks:</div>
						<div className={!isValid ? 'text-destructive' : ''}>
							{totalTricks} / {round.cardsPerPlayer}
							{!isValid && ' (not valid)'}
						</div>
					</div>

					{validationError && (
						<div className="text-destructive text-sm mt-2">{validationError}</div>
					)}

					{!isValid && !validationError && (
						<div className="text-amber-600 text-sm mt-2">
							Total tricks must equal the number of cards per player ({round.cardsPerPlayer}).
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleSave}
					className="w-full"
					disabled={!isValid || !!validationError}
					variant="success"
				>
					Save Tricks
				</Button>
			</CardFooter>
		</Card>
	);
};

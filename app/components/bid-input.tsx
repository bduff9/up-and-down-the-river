import * as React from 'react';
import type { Player, Round } from '~/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

type BidInputProps = {
	players: Player[];
	round: Round;
	onSave: (updatedRound: Round) => void;
};

export const BidInput: React.FC<BidInputProps> = ({ players, round, onSave }) => {
	const initialBids = round.playerResults.reduce<Record<string, number>>((acc, result) => {
		acc[result.playerId] = result.bid;
		return acc;
	}, {});

	const [bids, setBids] = React.useState<Record<string, number>>(initialBids);
	const [validationError, setValidationError] = React.useState<string | null>(null);

	function handleBidChange(playerId: string, bidValue: string): void {
		const bidNumber = Number.parseInt(bidValue, 10);

		// Allow empty input (reset to empty string)
		if (bidValue === '') {
			setBids((prev) => ({ ...prev, [playerId]: 0 }));
			setValidationError(null);
			return;
		}

		// Validate input is a number
		if (Number.isNaN(bidNumber)) {
			return;
		}

		// Validate bid is not negative
		if (bidNumber < 0) {
			setValidationError('Bids cannot be negative');
			return;
		}

		// Validate bid does not exceed cards per player
		if (bidNumber > round.cardsPerPlayer) {
			setValidationError(`Bids cannot exceed ${round.cardsPerPlayer} cards`);
			return;
		}

		// Clear validation error if any
		setValidationError(null);

		// Update bids
		setBids((prev) => ({ ...prev, [playerId]: bidNumber }));
	}

	function handleSave(): void {
		// Validate all players have submitted bids
		const hasAllBids = players.every((player) => bids[player.id] !== undefined);
		if (!hasAllBids) {
			setValidationError('All players must submit bids');
			return;
		}

		// Update round with new bids
		const updatedRound = {
			...round,
			playerResults: round.playerResults.map((result) => ({
				...result,
				bid: bids[result.playerId] || 0,
			})),
		};

		onSave(updatedRound);
	}

	// Calculate total bids
	const totalBids = Object.values(bids).reduce((sum, bid) => sum + bid, 0);
	const isHook = totalBids === round.cardsPerPlayer;

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
				<CardTitle>Enter Bids</CardTitle>
				<CardDescription>
					Round {round.number} • {round.cardsPerPlayer} cards per player • Trump:{' '}
					{formatTrumpSuit(round.trumpSuit)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{players.map((player) => (
						<div key={player.id} className="flex items-center gap-2">
							<Label htmlFor={`bid-${player.id}`} className="w-32">
								{player.name}
							</Label>
							<Input
								id={`bid-${player.id}`}
								type="number"
								min={0}
								max={round.cardsPerPlayer}
								value={bids[player.id] ?? ''}
								onChange={(e) => handleBidChange(player.id, e.target.value)}
								className="w-20"
							/>
						</div>
					))}

					<div className="flex items-center justify-between pt-2 text-sm font-medium">
						<div>Total Bids:</div>
						<div className={isHook ? 'text-destructive' : ''}>
							{totalBids} / {round.cardsPerPlayer}
							{isHook && ' (hook!)'}
						</div>
					</div>

					{validationError && (
						<div className="text-destructive text-sm mt-2">{validationError}</div>
					)}

					{isHook && !validationError && (
						<div className="text-amber-600 text-sm mt-2">
							Warning: Total bids match the number of tricks available. At least one player must
							fail to make their bid!
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={handleSave} className="w-full">
					Save Bids
				</Button>
			</CardFooter>
		</Card>
	);
};

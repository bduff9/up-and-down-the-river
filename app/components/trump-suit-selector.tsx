import * as React from 'react';
import type { Round } from '~/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type TrumpSuitSelectorProps = {
	round: Round;
	onSave: (updatedRound: Round) => void;
};

interface SuitOption {
	value: string;
	label: string;
	symbol: string;
	color: string;
}

export const TrumpSuitSelector: React.FC<TrumpSuitSelectorProps> = ({ round, onSave }) => {
	const [selectedSuit, setSelectedSuit] = React.useState<string | null>(round.trumpSuit);

	const suitOptions: SuitOption[] = [
		{ value: 'hearts', label: 'Hearts', symbol: '♥', color: 'text-red-600' },
		{ value: 'diamonds', label: 'Diamonds', symbol: '♦', color: 'text-red-600' },
		{ value: 'clubs', label: 'Clubs', symbol: '♣', color: 'text-black' },
		{ value: 'spades', label: 'Spades', symbol: '♠', color: 'text-black' },
		{ value: 'no-trump', label: 'No Trump', symbol: '∅', color: 'text-gray-600' },
	];

	function handleSave() {
		const updatedRound = {
			...round,
			trumpSuit: selectedSuit,
		};
		onSave(updatedRound);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Select Trump Suit</CardTitle>
				<CardDescription>
					Round {round.number} • {round.cardsPerPlayer} cards per player
				</CardDescription>
			</CardHeader>
			<CardContent>
				<RadioGroup
					value={selectedSuit || ''}
					onValueChange={setSelectedSuit}
					className="grid grid-cols-1 md:grid-cols-2 gap-4"
				>
					{suitOptions.map((suit) => (
						<div key={suit.value} className="flex items-center space-x-2">
							<RadioGroupItem value={suit.value} id={`suit-${suit.value}`} />
							<Label
								htmlFor={`suit-${suit.value}`}
								className="flex items-center space-x-2 cursor-pointer"
							>
								<span className={`text-2xl ${suit.color}`}>{suit.symbol}</span>
								<span>{suit.label}</span>
							</Label>
						</div>
					))}
				</RadioGroup>
			</CardContent>
			<CardFooter>
				<Button onClick={handleSave} className="w-full" disabled={selectedSuit === null}>
					Set Trump Suit
				</Button>
			</CardFooter>
		</Card>
	);
};

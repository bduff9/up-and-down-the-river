import type { Meta, StoryObj } from '@storybook/react';
import { RoundTracker } from '../app/components/round-tracker';
import type { Game, Round } from '../app/lib/types';

const meta = {
	title: 'Game/RoundTracker',
	component: RoundTracker,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof RoundTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const players = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Carol' },
	{ id: '4', name: 'Dave' },
];

// Create a complete game with multiple rounds
const createGame = (currentRoundNumber: number, completedRounds: number[] = []): Game => {
	// Generate rounds for a 4-player game
	const rounds: Round[] = [];
	// 10 down to 1, then back up to 10 (total 20 rounds)
	const cardsPerRound = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	for (let i = 0; i < cardsPerRound.length; i++) {
		const roundNumber = i + 1;
		const isComplete = completedRounds.includes(roundNumber);
		rounds.push({
			number: roundNumber,
			cardsPerPlayer: cardsPerRound[i],
			trumpSuit: ['hearts', 'diamonds', 'clubs', 'spades'][i % 4],
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: isComplete ? Math.floor(Math.random() * (cardsPerRound[i] + 1)) : 0,
				tricksTaken: isComplete ? Math.floor(Math.random() * (cardsPerRound[i] + 1)) : 0,
				roundScore: isComplete ? Math.floor(Math.random() * 15) : 0,
			})),
		});
	}

	return {
		id: '1',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		players,
		rounds,
		scoringRule: {
			type: 'standard',
			config: {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'zero',
				name: 'Standard',
				description: 'Standard scoring',
			},
		},
		isComplete: false,
		maxRounds: cardsPerRound.length,
		currentRound: currentRoundNumber,
	};
};

export const Round1: Story = {
	args: {
		game: createGame(1),
		currentRound: {
			number: 1,
			cardsPerPlayer: 10,
			trumpSuit: 'hearts',
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: 0,
				tricksTaken: 0,
				roundScore: 0,
			})),
		},
	},
};

export const MiddleGameWithCompletedRounds: Story = {
	args: {
		game: createGame(7, [1, 2, 3, 4, 5, 6]),
		currentRound: {
			number: 7,
			cardsPerPlayer: 4,
			trumpSuit: 'spades',
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: 1,
				tricksTaken: 0,
				roundScore: 0,
			})),
		},
	},
};

export const FinalRound: Story = {
	args: {
		game: createGame(
			19,
			Array.from({ length: 18 }, (_, i) => i + 1),
		),
		currentRound: {
			number: 19,
			cardsPerPlayer: 10,
			trumpSuit: 'diamonds',
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: 2,
				tricksTaken: 0,
				roundScore: 0,
			})),
		},
	},
};

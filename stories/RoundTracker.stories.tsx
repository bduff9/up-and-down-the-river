import type { Meta, StoryObj } from '@storybook/react';
import { RoundTracker } from '../app/components/round-tracker';
import type { Game, Round, RoundPattern } from '../app/lib/types';

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
const createGame = (
	currentRoundNumber: number,
	completedRounds: number[] = [],
	roundPattern: RoundPattern = 'down-up',
): Game => {
	// Generate rounds for a 4-player game based on pattern
	const rounds: Round[] = [];

	// Calculate cards per round based on the pattern
	let cardsPerRound: number[];

	if (roundPattern === 'down-up') {
		// 10 down to 1, then back up to 10 (total 19 rounds)
		cardsPerRound = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	} else {
		// 1 up to 10, 10 again, then back down to 1 (total 20 rounds)
		cardsPerRound = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	}

	for (let i = 0; i < cardsPerRound.length; i++) {
		const roundNumber = i + 1;
		const isComplete = completedRounds.includes(roundNumber);
		rounds.push({
			number: roundNumber,
			cardsPerPlayer: cardsPerRound[i],
			trumpSuit: ['hearts', 'diamonds', 'clubs', 'spades'][i % 4],
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: isComplete ? Math.floor(Math.random() * (cardsPerRound[i] + 1)) : null,
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
		roundPattern,
	};
};

export const DownUpPattern_Round1: Story = {
	args: {
		game: createGame(1, [], 'down-up'),
		currentRound: {
			number: 1,
			cardsPerPlayer: 10,
			trumpSuit: 'hearts',
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: null,
				tricksTaken: 0,
				roundScore: 0,
			})),
		},
	},
	parameters: {
		docs: {
			description: 'First round with Down-Up pattern (starts at max cards)',
		},
	},
};

export const UpDownPattern_Round1: Story = {
	args: {
		game: createGame(1, [], 'up-down'),
		currentRound: {
			number: 1,
			cardsPerPlayer: 1,
			trumpSuit: 'hearts',
			playerResults: players.map((player) => ({
				playerId: player.id,
				bid: null,
				tricksTaken: 0,
				roundScore: 0,
			})),
		},
	},
	parameters: {
		docs: {
			description: 'First round with Up-Down pattern (starts at 1 card)',
		},
	},
};

export const DownUpPattern_MiddleGame: Story = {
	args: {
		game: createGame(7, [1, 2, 3, 4, 5, 6], 'down-up'),
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
	parameters: {
		docs: {
			description: 'Middle of the game with Down-Up pattern and completed rounds',
		},
	},
};

export const UpDownPattern_MaxCardRound: Story = {
	args: {
		game: createGame(10, [1, 2, 3, 4, 5, 6, 7, 8, 9], 'up-down'),
		currentRound: {
			number: 10,
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
	parameters: {
		docs: {
			description: 'At the max card round with Up-Down pattern (first 10-card round)',
		},
	},
};

export const UpDownPattern_SecondMaxCardRound: Story = {
	args: {
		game: createGame(11, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'up-down'),
		currentRound: {
			number: 11,
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
	parameters: {
		docs: {
			description:
				'At the second max card round with Up-Down pattern (after reaching max, before going down)',
		},
	},
};

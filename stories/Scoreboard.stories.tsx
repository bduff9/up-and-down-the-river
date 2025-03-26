import type { Meta, StoryObj } from '@storybook/react';
import { Scoreboard } from '../app/components/scoreboard';
import type { Game, Round } from '../app/lib/types';

const meta = {
	title: 'Game/Scoreboard',
	component: Scoreboard,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Scoreboard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const players = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Carol' },
	{ id: '4', name: 'Dave' },
];

// Create a game with completed rounds and scores
const createGame = (roundsCount: number, isGameComplete = false, allZeroScores = false): Game => {
	const rounds: Round[] = [];

	// Create a set of rounds (1-10 cards per player)
	for (let i = 0; i < roundsCount; i++) {
		const roundNumber = i + 1;
		const cardsPerPlayer = roundNumber <= 10 ? 11 - roundNumber : roundNumber - 10;

		rounds.push({
			number: roundNumber,
			cardsPerPlayer,
			trumpSuit: ['hearts', 'diamonds', 'clubs', 'spades'][i % 4],
			playerResults: players.map((player, index) => {
				if (allZeroScores) {
					// For the zero scores scenario
					return {
						playerId: player.id,
						bid: 0,
						tricksTaken: 0,
						roundScore: 0,
					};
				}

				// Create somewhat realistic scores with some variation
				const bid = Math.floor(Math.random() * (cardsPerPlayer + 1));
				const tricksTaken = Math.floor(Math.random() * (cardsPerPlayer + 1));
				const madeBid = bid === tricksTaken;
				const roundScore = madeBid ? bid + 10 : tricksTaken;

				// Favor the first player slightly to create a clear winner
				return {
					playerId: player.id,
					bid,
					tricksTaken,
					roundScore: index === 0 ? roundScore + 2 : roundScore,
				};
			}),
		});
	}

	// Calculate the current round
	const currentRound = isGameComplete ? roundsCount : Math.min(roundsCount + 1, 19);

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
		isComplete: isGameComplete,
		maxRounds: 19,
		currentRound,
		winner: isGameComplete ? players[0] : undefined,
		roundPattern: 'down-up', // Add the required roundPattern
	};
};

export const EarlyGame: Story = {
	args: {
		game: createGame(3),
	},
};

export const MidGame: Story = {
	args: {
		game: createGame(10),
	},
};

export const CompletedGame: Story = {
	args: {
		game: createGame(19, true),
	},
};

// Add new stories for testing star logic
export const AllZeroScores: Story = {
	args: {
		game: createGame(3, false, true),
	},
	parameters: {
		docs: {
			description: 'Game where all players have zero points - no stars should be shown',
		},
	},
};

export const CompletedGameWithZeroScores: Story = {
	args: {
		game: createGame(19, true, true),
	},
	parameters: {
		docs: {
			description:
				'Completed game where all players have zero points - special message should be shown',
		},
	},
};

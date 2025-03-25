import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TricksInput } from '../app/components/tricks-input';
import type { ScoringRuleConfig } from '../app/lib/types';

const meta = {
	title: 'Game/TricksInput',
	component: TricksInput,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onSave: fn(),
	},
} satisfies Meta<typeof TricksInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const players = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Carol' },
];

const round = {
	number: 1,
	cardsPerPlayer: 5,
	trumpSuit: 'hearts',
	playerResults: [
		{ playerId: '1', bid: 2, tricksTaken: 0, roundScore: 0 },
		{ playerId: '2', bid: 1, tricksTaken: 0, roundScore: 0 },
		{ playerId: '3', bid: 1, tricksTaken: 0, roundScore: 0 },
	],
};

// Standard scoring rule configuration
const standardScoringRuleConfig: ScoringRuleConfig = {
	exactBidBonus: 10,
	pointsPerTrick: 1,
	pointsForMissingBid: 'zero',
	name: 'Standard',
	description: 'Regular scoring with bonus for exact bids',
};

export const Default: Story = {
	args: {
		players,
		round,
		scoringRuleConfig: standardScoringRuleConfig,
	},
};

export const WithTricks: Story = {
	args: {
		players,
		round: {
			...round,
			playerResults: [
				{ playerId: '1', bid: 2, tricksTaken: 2, roundScore: 12 },
				{ playerId: '2', bid: 1, tricksTaken: 1, roundScore: 11 },
				{ playerId: '3', bid: 1, tricksTaken: 2, roundScore: 2 },
			],
		},
		scoringRuleConfig: standardScoringRuleConfig,
	},
};

export const PenaltyScoringRule: Story = {
	args: {
		players,
		round,
		scoringRuleConfig: {
			exactBidBonus: 10,
			pointsPerTrick: 1,
			pointsForMissingBid: 'penalty',
			penaltyPerTrick: 2,
			name: 'Penalty',
			description: 'Penalizes missed bids',
		} as ScoringRuleConfig,
	},
};

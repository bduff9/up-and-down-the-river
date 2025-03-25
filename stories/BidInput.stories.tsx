import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BidInput } from '../app/components/bid-input';

const meta = {
	title: 'Game/BidInput',
	component: BidInput,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onSave: fn(),
	},
} satisfies Meta<typeof BidInput>;

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
		{ playerId: '1', bid: 0, tricksTaken: 0, roundScore: 0 },
		{ playerId: '2', bid: 0, tricksTaken: 0, roundScore: 0 },
		{ playerId: '3', bid: 0, tricksTaken: 0, roundScore: 0 },
	],
};

export const Default: Story = {
	args: {
		players,
		round,
	},
};

export const WithBids: Story = {
	args: {
		players,
		round: {
			...round,
			playerResults: [
				{ playerId: '1', bid: 2, tricksTaken: 0, roundScore: 0 },
				{ playerId: '2', bid: 1, tricksTaken: 0, roundScore: 0 },
				{ playerId: '3', bid: 0, tricksTaken: 0, roundScore: 0 },
			],
		},
	},
};

export const HookWarning: Story = {
	args: {
		players,
		round: {
			...round,
			playerResults: [
				{ playerId: '1', bid: 2, tricksTaken: 0, roundScore: 0 },
				{ playerId: '2', bid: 2, tricksTaken: 0, roundScore: 0 },
				{ playerId: '3', bid: 1, tricksTaken: 0, roundScore: 0 },
			],
		},
	},
};

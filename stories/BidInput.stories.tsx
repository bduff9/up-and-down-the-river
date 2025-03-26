import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BidInput } from '../app/components/bid-input';

const meta = {
	title: 'Game/BidInput',
	component: BidInput,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
The BidInput component allows users to enter their bids for a round.
In version 1.5, we updated this component to handle null bid values,
which indicate that a bid has not been entered yet (different from a bid of 0).
This improves game resumption logic by properly detecting the bidding phase.
`,
			},
		},
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
		{ playerId: '1', bid: null, tricksTaken: 0, roundScore: 0 },
		{ playerId: '2', bid: null, tricksTaken: 0, roundScore: 0 },
		{ playerId: '3', bid: null, tricksTaken: 0, roundScore: 0 },
	],
};

export const Default: Story = {
	args: {
		players,
		round,
	},
	parameters: {
		docs: {
			description: 'Initial state with all bids set to null (no bids entered yet)',
		},
	},
};

export const PartiallyFilledBids: Story = {
	args: {
		players,
		round: {
			...round,
			playerResults: [
				{ playerId: '1', bid: 2, tricksTaken: 0, roundScore: 0 },
				{ playerId: '2', bid: 1, tricksTaken: 0, roundScore: 0 },
				{ playerId: '3', bid: null, tricksTaken: 0, roundScore: 0 },
			],
		},
	},
	parameters: {
		docs: {
			description: 'Some players have entered bids, but one player still has a null bid',
		},
	},
};

export const AllBidsEntered: Story = {
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
	parameters: {
		docs: {
			description: 'All players have entered bids, including one player bidding 0',
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
	parameters: {
		docs: {
			description: 'Sum of bids equals available tricks, triggering a "hook" warning',
		},
	},
};

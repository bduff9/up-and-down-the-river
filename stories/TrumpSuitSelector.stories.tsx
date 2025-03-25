import type { Meta, StoryObj } from '@storybook/react';
import { TrumpSuitSelector } from '../app/components/trump-suit-selector';
import { StoryWrapper } from './StoryWrapper';

const meta: Meta<typeof TrumpSuitSelector> = {
	title: 'Game/TrumpSuitSelector',
	component: TrumpSuitSelector,
	parameters: {
		layout: 'centered',
	},
	decorators: [
		(Story) => (
			<StoryWrapper>
				<div className="w-[500px]">
					<Story />
				</div>
			</StoryWrapper>
		),
	],
};

export default meta;
type Story = StoryObj<typeof TrumpSuitSelector>;

// Create sample round data
const sampleRound = {
	number: 1,
	cardsPerPlayer: 10,
	trumpSuit: null,
	playerResults: [
		{ playerId: 'player1', bid: -1, tricksTaken: 0, roundScore: 0 },
		{ playerId: 'player2', bid: -1, tricksTaken: 0, roundScore: 0 },
		{ playerId: 'player3', bid: -1, tricksTaken: 0, roundScore: 0 },
		{ playerId: 'player4', bid: -1, tricksTaken: 0, roundScore: 0 },
	],
};

export const Default: Story = {
	args: {
		round: sampleRound,
		onSave: (updatedRound) => {
			console.log('Trump selected:', updatedRound.trumpSuit);
		},
	},
};

export const WithTrumpSelected: Story = {
	args: {
		round: {
			...sampleRound,
			trumpSuit: 'hearts',
		},
		onSave: (updatedRound) => {
			console.log('Trump selected:', updatedRound.trumpSuit);
		},
	},
};

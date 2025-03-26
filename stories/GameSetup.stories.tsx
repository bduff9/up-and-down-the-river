import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { GameSetup } from '../app/components/game-setup';

// Wrapper to provide router context
const GameSetupWithRouter = () => (
	<MemoryRouter>
		<div className="container max-w-3xl p-4">
			<GameSetup />
		</div>
	</MemoryRouter>
);

const meta = {
	title: 'Game/GameSetup',
	component: GameSetupWithRouter,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
The GameSetup component allows users to configure a new game. In version 1.5, we added:

- Round pattern selection to choose between "Down-Up" (start at max cards, go down to 1, then back up) or
- "Up-Down" (start at 1 card, go up to max cards twice, then back down)

The component visualizes the selected pattern so users can understand the round structure.
`,
			},
		},
	},
	tags: ['autodocs'],
} satisfies Meta<typeof GameSetupWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Standard story for GameSetup
export const Default: Story = {
	parameters: {
		docs: {
			description: 'The default game setup screen with the standard options',
		},
	},
};

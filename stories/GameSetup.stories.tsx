import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { GameSetup } from '../app/components/game-setup';

// Wrapper to provide router context
const GameSetupWithRouter = () => (
	<MemoryRouter>
		<GameSetup />
	</MemoryRouter>
);

const meta = {
	title: 'Game/GameSetup',
	component: GameSetupWithRouter,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof GameSetupWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Just one simple story for GameSetup
export const Default: Story = {};

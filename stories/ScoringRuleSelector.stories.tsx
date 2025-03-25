import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ScoringRuleSelector from '../app/components/scoring-rule-selector';

const meta = {
	title: 'Game/ScoringRuleSelector',
	component: ScoringRuleSelector,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onChange: fn(),
	},
} satisfies Meta<typeof ScoringRuleSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
	args: {
		value: 'standard',
	},
};

export const Simple: Story = {
	args: {
		value: 'simple',
	},
};

export const Common: Story = {
	args: {
		value: 'common',
	},
};

export const Penalty: Story = {
	args: {
		value: 'penalty',
	},
};

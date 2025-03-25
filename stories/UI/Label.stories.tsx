import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';

const meta = {
	title: 'UI/Label',
	component: Label,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Label',
	},
};

export const WithInput: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Label htmlFor="example">Example Label</Label>
			<Input id="example" placeholder="Input with label" />
		</div>
	),
};

export const Required: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Label htmlFor="required">
				Required Field <span className="text-destructive">*</span>
			</Label>
			<Input id="required" placeholder="Required field" required />
		</div>
	),
};

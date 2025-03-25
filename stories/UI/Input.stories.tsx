import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';

const meta = {
	title: 'UI/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onChange: fn(),
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Input placeholder="Type something here..." />
		</div>
	),
};

export const WithLabel: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Label htmlFor="name">Name</Label>
			<Input id="name" placeholder="Enter your name" />
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-2">
			<Label htmlFor="disabled">Disabled</Label>
			<Input id="disabled" placeholder="You can't type here" disabled />
		</div>
	),
};

export const WithType: Story = {
	render: () => (
		<div className="w-full max-w-sm space-y-4">
			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" type="email" placeholder="Email address" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input id="password" type="password" placeholder="Password" />
			</div>
			<div className="space-y-2">
				<Label htmlFor="number">Number</Label>
				<Input id="number" type="number" placeholder="Number" />
			</div>
		</div>
	),
};

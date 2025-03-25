import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from '../../app/components/ui/button';
import { StoryWrapper } from '../StoryWrapper';

// Create a wrapper component that provides proper styling context
const ButtonWithStyling = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
	<StoryWrapper>
		<Button {...props}>{children}</Button>
	</StoryWrapper>
);

const meta = {
	title: 'UI/Button',
	component: ButtonWithStyling,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onClick: fn(),
		children: 'Button',
	},
} satisfies Meta<typeof ButtonWithStyling>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
	args: {
		variant: 'secondary',
	},
};

export const Destructive: Story = {
	args: {
		variant: 'destructive',
	},
};

export const Outline: Story = {
	args: {
		variant: 'outline',
	},
};

export const Ghost: Story = {
	args: {
		variant: 'ghost',
	},
};

export const Link: Story = {
	args: {
		variant: 'link',
	},
};

export const Small: Story = {
	args: {
		size: 'sm',
	},
};

export const Large: Story = {
	args: {
		size: 'lg',
	},
};

export const IconButton: Story = {
	args: {
		size: 'icon',
		children: '🔍',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

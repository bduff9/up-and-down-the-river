import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../app/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../../app/components/ui/card';

// Define a wrapper component to demonstrate all card parts together
const CardDemo = () => (
	<div className="p-4 bg-background text-foreground">
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card Description</CardDescription>
			</CardHeader>
			<CardContent>
				<p>This is the card content area. You can put any content here.</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Submit</Button>
			</CardFooter>
		</Card>
	</div>
);

const meta = {
	title: 'UI/Card',
	component: CardDemo,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof CardDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example with all card components
export const Default: Story = {};

// Individual card components
export const CardOnly: Story = {
	render: () => (
		<div className="p-4 bg-background text-foreground">
			<Card className="w-[350px] p-6">
				<p>This is a basic card with just the Card component and no subcomponents.</p>
			</Card>
		</div>
	),
};

export const WithHeaderOnly: Story = {
	render: () => (
		<div className="p-4 bg-background text-foreground">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
			</Card>
		</div>
	),
};

export const WithContentOnly: Story = {
	render: () => (
		<div className="p-4 bg-background text-foreground">
			<Card className="w-[350px]">
				<CardContent>
					<p>This card only has content without header or footer.</p>
				</CardContent>
			</Card>
		</div>
	),
};

export const WithFooterOnly: Story = {
	render: () => (
		<div className="p-4 bg-background text-foreground">
			<Card className="w-[350px]">
				<CardFooter className="flex justify-between">
					<Button variant="outline">Cancel</Button>
					<Button>Submit</Button>
				</CardFooter>
			</Card>
		</div>
	),
};

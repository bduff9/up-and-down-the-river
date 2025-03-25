import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Label } from '../../app/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '../../app/components/ui/select';

// Define a wrapper component for Select
const SelectDemo = (props: {
	placeholder?: string;
	disabled?: boolean;
	withLabel?: boolean;
	withGroups?: boolean;
	onChange?: (value: string) => void;
}) => {
	const {
		placeholder = 'Select an option',
		disabled = false,
		withLabel = false,
		withGroups = false,
		onChange = () => {},
	} = props;

	return (
		<div className="w-full max-w-xs space-y-2">
			{withLabel && <Label htmlFor="select-demo">Select an option</Label>}

			<Select onValueChange={onChange} disabled={disabled}>
				<SelectTrigger id="select-demo" className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{withGroups ? (
						<>
							<SelectGroup>
								<SelectLabel>Fruits</SelectLabel>
								<SelectItem value="apple">Apple</SelectItem>
								<SelectItem value="banana">Banana</SelectItem>
								<SelectItem value="orange">Orange</SelectItem>
							</SelectGroup>
							<SelectGroup>
								<SelectLabel>Vegetables</SelectLabel>
								<SelectItem value="carrot">Carrot</SelectItem>
								<SelectItem value="broccoli">Broccoli</SelectItem>
								<SelectItem value="spinach">Spinach</SelectItem>
							</SelectGroup>
						</>
					) : (
						<>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="orange">Orange</SelectItem>
							<SelectItem value="carrot">Carrot</SelectItem>
							<SelectItem value="broccoli">Broccoli</SelectItem>
						</>
					)}
				</SelectContent>
			</Select>
		</div>
	);
};

const meta = {
	title: 'UI/Select',
	component: SelectDemo,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		onChange: fn(),
	},
} satisfies Meta<typeof SelectDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
	args: {
		withLabel: true,
	},
};

export const WithGroups: Story = {
	args: {
		withGroups: true,
	},
};

export const WithCustomPlaceholder: Story = {
	args: {
		placeholder: 'Choose an item...',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Player, Round, ScoringRuleConfig } from '~/lib/types';
import { TricksInput } from './tricks-input';

describe('TricksInput', () => {
	// Mock data
	const players: Player[] = [
		{ id: 'player1', name: 'Player 1' },
		{ id: 'player2', name: 'Player 2' },
		{ id: 'player3', name: 'Player 3' },
	];

	const round: Round = {
		number: 1,
		cardsPerPlayer: 5,
		trumpSuit: 'hearts',
		playerResults: [
			{ playerId: 'player1', bid: 2, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player2', bid: 1, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player3', bid: 1, tricksTaken: 0, roundScore: 0 },
		],
	};

	const scoringRuleConfig: ScoringRuleConfig = {
		exactBidBonus: 10,
		pointsPerTrick: 1,
		pointsForMissingBid: 'zero',
		name: 'Standard',
		description: 'Standard scoring rules',
	};

	const onSaveMock = vi.fn();

	beforeEach(() => {
		onSaveMock.mockClear();
	});

	it('renders player names and tricks inputs', () => {
		render(
			<TricksInput
				players={players}
				round={round}
				scoringRuleConfig={scoringRuleConfig}
				onSave={onSaveMock}
			/>,
		);

		// Check component title
		expect(screen.getByText('Enter Tricks Taken')).toBeInTheDocument();

		// Check round info
		expect(screen.getByText(/Round 1/)).toBeInTheDocument();
		expect(screen.getByText(/5 cards per player/)).toBeInTheDocument();

		// Check player names
		expect(screen.getByText('Player 1')).toBeInTheDocument();
		expect(screen.getByText('Player 2')).toBeInTheDocument();
		expect(screen.getByText('Player 3')).toBeInTheDocument();

		// Check inputs
		expect(screen.getByLabelText('Player 1')).toBeInTheDocument();
		expect(screen.getByLabelText('Player 2')).toBeInTheDocument();
		expect(screen.getByLabelText('Player 3')).toBeInTheDocument();

		// Check bid displays
		expect(screen.getByText('Bid: 2')).toBeInTheDocument();
		expect(screen.getAllByText('Bid: 1')).toHaveLength(2);
	});

	it('updates tricks and scores when input values change', () => {
		render(
			<TricksInput
				players={players}
				round={round}
				scoringRuleConfig={scoringRuleConfig}
				onSave={onSaveMock}
			/>,
		);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;
		const player2Input = screen.getByLabelText('Player 2') as HTMLInputElement;
		const player3Input = screen.getByLabelText('Player 3') as HTMLInputElement;

		// Enter tricks
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '1' } });
		fireEvent.change(player3Input, { target: { value: '2' } });

		// Check scores are updated
		expect(screen.getByText('Score: 12')).toBeInTheDocument(); // Player 1: made bid exactly (2 tricks + 10 bonus)
		expect(screen.getByText('Score: 11')).toBeInTheDocument(); // Player 2: made bid exactly (1 trick + 10 bonus)
		expect(screen.getByText('Score: 0')).toBeInTheDocument(); // Player 3: missed bid (0 points)

		// Check total tricks
		expect(screen.getByText('5 / 5')).toBeInTheDocument();
	});

	it('shows validation error when tricks exceed cards per player', () => {
		render(
			<TricksInput
				players={players}
				round={round}
				scoringRuleConfig={scoringRuleConfig}
				onSave={onSaveMock}
			/>,
		);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;

		// Enter invalid tricks amount
		fireEvent.change(player1Input, { target: { value: '6' } });

		// Check error message
		expect(screen.getByText('Tricks cannot exceed 5 cards')).toBeInTheDocument();
	});

	it('shows validation error when total tricks do not equal cards per player', () => {
		render(
			<TricksInput
				players={players}
				round={round}
				scoringRuleConfig={scoringRuleConfig}
				onSave={onSaveMock}
			/>,
		);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;
		const player2Input = screen.getByLabelText('Player 2') as HTMLInputElement;
		const player3Input = screen.getByLabelText('Player 3') as HTMLInputElement;

		// Enter tricks that don't sum to cards per player
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '1' } });
		fireEvent.change(player3Input, { target: { value: '1' } });

		// Check warning appears
		expect(screen.getByText('4 / 5 (not valid)')).toBeInTheDocument();
		expect(
			screen.getByText(/Total tricks must equal the number of cards per player/),
		).toBeInTheDocument();
	});

	it('enables save button only when total tricks equals cards per player', () => {
		render(
			<TricksInput
				players={players}
				round={round}
				scoringRuleConfig={scoringRuleConfig}
				onSave={onSaveMock}
			/>,
		);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;
		const player2Input = screen.getByLabelText('Player 2') as HTMLInputElement;
		const player3Input = screen.getByLabelText('Player 3') as HTMLInputElement;
		const saveButton = screen.getByText('Save Tricks');

		// Initially save button should be disabled
		expect(saveButton).toBeDisabled();

		// Enter tricks that don't sum to cards per player
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '1' } });
		fireEvent.change(player3Input, { target: { value: '1' } });

		// Button should still be disabled
		expect(saveButton).toBeDisabled();

		// Correct the tricks to sum to cards per player
		fireEvent.change(player3Input, { target: { value: '2' } });

		// Button should now be enabled
		expect(saveButton).not.toBeDisabled();
	});

	it('calls onSave with updated round when Save Tricks button is clicked', () => {
		render(
			<TricksInput
				players={players}
				round={round}
				scoringRuleConfig={scoringRuleConfig}
				onSave={onSaveMock}
			/>,
		);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;
		const player2Input = screen.getByLabelText('Player 2') as HTMLInputElement;
		const player3Input = screen.getByLabelText('Player 3') as HTMLInputElement;

		// Enter tricks that sum to cards per player
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '1' } });
		fireEvent.change(player3Input, { target: { value: '2' } });

		// Click save button
		fireEvent.click(screen.getByText('Save Tricks'));

		// Check onSave was called with correct data
		expect(onSaveMock).toHaveBeenCalledTimes(1);
		expect(onSaveMock).toHaveBeenCalledWith({
			...round,
			playerResults: [
				{ playerId: 'player1', bid: 2, tricksTaken: 2, roundScore: 12 },
				{ playerId: 'player2', bid: 1, tricksTaken: 1, roundScore: 11 },
				{ playerId: 'player3', bid: 1, tricksTaken: 2, roundScore: 0 },
			],
		});
	});
});

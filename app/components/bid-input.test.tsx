import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Player, Round } from '~/lib/types';
import { BidInput } from './bid-input';

describe('BidInput', () => {
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
			{ playerId: 'player1', bid: -1, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player2', bid: -1, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player3', bid: -1, tricksTaken: 0, roundScore: 0 },
		],
	};

	const onSaveMock = vi.fn();

	beforeEach(() => {
		onSaveMock.mockClear();
	});

	it('renders player names and bid inputs', () => {
		render(<BidInput players={players} round={round} onSave={onSaveMock} />);

		// Check component title
		expect(screen.getByText('Enter Bids')).toBeInTheDocument();

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
	});

	it('updates bids when input values change', () => {
		render(<BidInput players={players} round={round} onSave={onSaveMock} />);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;
		const player2Input = screen.getByLabelText('Player 2') as HTMLInputElement;
		const player3Input = screen.getByLabelText('Player 3') as HTMLInputElement;

		// Enter bids
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '1' } });
		fireEvent.change(player3Input, { target: { value: '1' } });

		// Check inputs have updated
		expect(player1Input.value).toBe('2');
		expect(player2Input.value).toBe('1');
		expect(player3Input.value).toBe('1');

		// Check total bids
		expect(screen.getByText('4 / 5')).toBeInTheDocument();
	});

	it('shows validation error when bid exceeds cards per player', () => {
		render(<BidInput players={players} round={round} onSave={onSaveMock} />);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;

		// Enter invalid bid
		fireEvent.change(player1Input, { target: { value: '6' } });

		// Check error message
		expect(screen.getByText('Bids cannot exceed 5 cards')).toBeInTheDocument();
	});

	it('shows hook warning when total bids match available tricks', () => {
		render(<BidInput players={players} round={round} onSave={onSaveMock} />);

		const player1Input = screen.getByLabelText('Player 1') as HTMLInputElement;
		const player2Input = screen.getByLabelText('Player 2') as HTMLInputElement;
		const player3Input = screen.getByLabelText('Player 3') as HTMLInputElement;

		// Enter bids that sum to available tricks
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '2' } });
		fireEvent.change(player3Input, { target: { value: '1' } });

		// Check hook warning appears
		expect(screen.getByText('5 / 5 (hook!)')).toBeInTheDocument();
		expect(
			screen.getByText(/Warning: Total bids match the number of tricks available/),
		).toBeInTheDocument();
	});

	it('calls onSave with updated round when Save Bids button is clicked', () => {
		render(<BidInput players={players} round={round} onSave={onSaveMock} />);

		const player1Input = screen.getByLabelText('Player 1');
		const player2Input = screen.getByLabelText('Player 2');
		const player3Input = screen.getByLabelText('Player 3');

		// Enter bids
		fireEvent.change(player1Input, { target: { value: '2' } });
		fireEvent.change(player2Input, { target: { value: '1' } });
		fireEvent.change(player3Input, { target: { value: '1' } });

		// Click save button
		fireEvent.click(screen.getByText('Save Bids'));

		// Check onSave was called with correct data
		expect(onSaveMock).toHaveBeenCalledTimes(1);
		expect(onSaveMock).toHaveBeenCalledWith({
			...round,
			playerResults: [
				{ playerId: 'player1', bid: 2, tricksTaken: 0, roundScore: 0 },
				{ playerId: 'player2', bid: 1, tricksTaken: 0, roundScore: 0 },
				{ playerId: 'player3', bid: 1, tricksTaken: 0, roundScore: 0 },
			],
		});
	});
});

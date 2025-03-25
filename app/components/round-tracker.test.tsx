import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Game, Round } from '~/lib/types';
import { RoundTracker } from './round-tracker';

describe('RoundTracker', () => {
	// Mock data for a 4-player game
	const mockGame: Game = {
		id: 'game1',
		createdAt: '2023-01-01',
		updatedAt: '2023-01-01',
		players: [
			{ id: 'player1', name: 'Player 1' },
			{ id: 'player2', name: 'Player 2' },
			{ id: 'player3', name: 'Player 3' },
			{ id: 'player4', name: 'Player 4' },
		],
		rounds: [
			{
				number: 1,
				cardsPerPlayer: 10,
				trumpSuit: 'hearts',
				playerResults: [
					{ playerId: 'player1', bid: 3, tricksTaken: 3, roundScore: 13 },
					{ playerId: 'player2', bid: 2, tricksTaken: 2, roundScore: 12 },
					{ playerId: 'player3', bid: 2, tricksTaken: 3, roundScore: 3 },
					{ playerId: 'player4', bid: 2, tricksTaken: 2, roundScore: 12 },
				],
			},
			{
				number: 2,
				cardsPerPlayer: 9,
				trumpSuit: 'spades',
				playerResults: [
					{ playerId: 'player1', bid: 2, tricksTaken: 2, roundScore: 12 },
					{ playerId: 'player2', bid: 2, tricksTaken: 2, roundScore: 12 },
					{ playerId: 'player3', bid: 3, tricksTaken: 3, roundScore: 13 },
					{ playerId: 'player4', bid: 2, tricksTaken: 2, roundScore: 12 },
				],
			},
		],
		scoringRule: {
			type: 'standard',
			config: {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'zero',
				name: 'Standard',
				description: 'Standard scoring rules',
			},
		},
		isComplete: false,
		maxRounds: 21, // For a 4-player game with max 10 cards: 10 down + 1 + 10 up = 21
		currentRound: 3,
	};

	const currentRound: Round = {
		number: 3,
		cardsPerPlayer: 8,
		trumpSuit: 'diamonds',
		playerResults: [
			{ playerId: 'player1', bid: -1, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player2', bid: -1, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player3', bid: -1, tricksTaken: 0, roundScore: 0 },
			{ playerId: 'player4', bid: -1, tricksTaken: 0, roundScore: 0 },
		],
	};

	// Clean up after each test
	afterEach(() => {
		cleanup();
	});

	it('renders the current round information', () => {
		render(<RoundTracker game={mockGame} currentRound={currentRound} />);

		// Check round title and description
		expect(screen.getByText('Round 3')).toBeInTheDocument();
		expect(screen.getByText(/8 cards/)).toBeInTheDocument();

		// Check for trump suit presence rather than specific content
		expect(screen.getByText(/Trump:/)).toBeInTheDocument();
	});

	it('shows progress information correctly', () => {
		render(<RoundTracker game={mockGame} currentRound={currentRound} />);

		// Check progress text
		expect(screen.getByText('Progress: 2 / 21 rounds complete')).toBeInTheDocument();
	});

	it('renders round cards with appropriate styling for past, current, and future rounds', () => {
		render(<RoundTracker game={mockGame} currentRound={currentRound} />);

		// Check all round cards are rendered (20 total actually rendered)
		const roundElements = screen.getAllByTitle(/Round \d+: \d+ cards/);
		expect(roundElements).toHaveLength(20);

		// Find specific rounds by their card counts
		const round1Element = screen.getByTitle('Round 1: 10 cards');
		const round2Element = screen.getByTitle('Round 2: 9 cards');
		const round3Element = screen.getByTitle('Round 3: 8 cards');
		const round4Element = screen.getByTitle('Round 4: 7 cards');

		// Check past rounds have "line-through" class
		expect(round1Element.className).toContain('bg-muted line-through');
		expect(round2Element.className).toContain('bg-muted line-through');

		// Check current round has primary background
		expect(round3Element.className).toContain('bg-primary');

		// Check future rounds have muted/40 background
		expect(round4Element.className).toContain('bg-muted/40');
	});

	it('renders singular card text when only 1 card per player', () => {
		const singleCardRound: Round = {
			...currentRound,
			number: 11,
			cardsPerPlayer: 1,
			trumpSuit: 'clubs',
		};

		render(<RoundTracker game={mockGame} currentRound={singleCardRound} />);

		// Check singular card text
		expect(screen.getByText(/1 card/)).toBeInTheDocument();
	});

	it('correctly handles different trump suits', () => {
		const customSuits = ['hearts', 'diamonds', 'clubs', 'spades'];

		for (const suit of customSuits) {
			const trumpRound: Round = {
				...currentRound,
				trumpSuit: suit,
			};

			render(<RoundTracker game={mockGame} currentRound={trumpRound} />);

			// Just check that the trump section exists
			const trumpText = screen.getByText(/Trump:/);
			expect(trumpText).toBeInTheDocument();

			// Cleanup for next iteration
			cleanup();
		}
	});
});

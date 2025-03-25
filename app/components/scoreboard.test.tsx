import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Game } from '~/lib/types';
import { Scoreboard } from './scoreboard';

describe('Scoreboard', () => {
	// Mock data for a 3-player game with 2 completed rounds
	const mockGame: Game = {
		id: 'game1',
		createdAt: '2023-01-01',
		updatedAt: '2023-01-01',
		players: [
			{ id: 'player1', name: 'Alice' },
			{ id: 'player2', name: 'Bob' },
			{ id: 'player3', name: 'Charlie' },
		],
		rounds: [
			{
				number: 1,
				cardsPerPlayer: 10,
				trumpSuit: 'hearts',
				playerResults: [
					{ playerId: 'player1', bid: 3, tricksTaken: 3, roundScore: 13 },
					{ playerId: 'player2', bid: 2, tricksTaken: 2, roundScore: 12 },
					{ playerId: 'player3', bid: 4, tricksTaken: 5, roundScore: 5 },
				],
			},
			{
				number: 2,
				cardsPerPlayer: 9,
				trumpSuit: 'spades',
				playerResults: [
					{ playerId: 'player1', bid: 2, tricksTaken: 3, roundScore: 3 },
					{ playerId: 'player2', bid: 3, tricksTaken: 3, roundScore: 13 },
					{ playerId: 'player3', bid: 3, tricksTaken: 3, roundScore: 13 },
				],
			},
		],
		scoringRule: {
			type: 'standard',
			config: {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'tricksOnly',
				name: 'Standard',
				description: 'Standard scoring rules',
			},
		},
		isComplete: false,
		maxRounds: 19,
		currentRound: 3,
	};

	it('renders the scoreboard with player names and scores', () => {
		render(<Scoreboard game={mockGame} />);

		// Check title and description
		expect(screen.getByText('Scoreboard')).toBeInTheDocument();
		expect(screen.getByText('Round 3 of 19')).toBeInTheDocument();

		// Check player names
		expect(screen.getByText('Alice')).toBeInTheDocument();
		expect(screen.getByText('Bob')).toBeInTheDocument();
		expect(screen.getByText('Charlie')).toBeInTheDocument();

		// Check round numbers in header
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();

		// Check scores - use getAllByTitle for potentially duplicate titles
		const madeBidCells = screen.getAllByTitle('Bid: 3, Took: 3');
		expect(madeBidCells[0]).toHaveTextContent('13');

		expect(screen.getByTitle('Bid: 2, Took: 2')).toHaveTextContent('12');
		expect(screen.getByTitle('Bid: 4, Took: 5')).toHaveTextContent('5');
		expect(screen.getByTitle('Bid: 2, Took: 3')).toHaveTextContent('3');
		expect(screen.getAllByTitle('Bid: 3, Took: 3')).toHaveLength(3);

		// Check total scores (Alice: 16, Bob: 25, Charlie: 18)
		const totals = screen.getAllByText(/\d+/, { selector: 'td.font-bold' });
		expect(totals).toHaveLength(3);

		// The players should be sorted by total score (highest first)
		const rows = screen.getAllByRole('row');
		const playerCells = rows.slice(1).map((row) => row.firstChild?.textContent);
		expect(playerCells[0]).toContain('Bob'); // 25 points
		expect(playerCells[1]).toContain('Charlie'); // 18 points
		expect(playerCells[2]).toContain('Alice'); // 16 points
	});

	it('applies correct styling to scores', () => {
		render(<Scoreboard game={mockGame} />);

		// Check for made bid styling (green)
		// Use specific indices for cells with the same title
		const madeBidScores = [
			screen.getAllByTitle('Bid: 3, Took: 3')[0],
			screen.getByTitle('Bid: 2, Took: 2'),
		];

		for (const score of madeBidScores) {
			expect(score).toHaveClass('text-green-600');
		}

		// Check for missed bid styling (red)
		const missedBidScores = [
			screen.getByTitle('Bid: 4, Took: 5'),
			screen.getByTitle('Bid: 2, Took: 3'),
		];

		for (const score of missedBidScores) {
			expect(score).toHaveClass('text-destructive');
		}
	});

	it('shows the leader with a star', () => {
		render(<Scoreboard game={mockGame} />);

		// Bob should have the star as the leader with 25 points
		const leaderRow = screen.getAllByRole('row')[1]; // First row after header
		const leaderCell = leaderRow.firstChild;
		expect(leaderCell).toHaveTextContent('Bob★');
	});

	it('displays winner message when game is complete', () => {
		const completedGame = {
			...mockGame,
			isComplete: true,
		};

		render(<Scoreboard game={completedGame} />);

		// Check for winner message
		expect(screen.getByText('Winner: Bob!')).toBeInTheDocument();

		// Check description shows completed status
		expect(screen.getByText('Game completed')).toBeInTheDocument();
	});
});

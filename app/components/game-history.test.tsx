import * as remixReact from '@remix-run/react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as storage from '../lib/storage';
import type { Game, ScoringRuleType } from '../lib/types';
import { GameHistory } from './game-history';

// Mock the storage module
vi.mock('../lib/storage', () => ({
	getGameHistory: vi.fn(),
	deleteGameFromHistory: vi.fn(),
	clearAllGameData: vi.fn(),
}));

// Mock the useNavigate hook
vi.mock('@remix-run/react', () => ({
	useNavigate: vi.fn(),
}));

describe('GameHistory', () => {
	// Setup before each test
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock navigate function
		const navigateMock = vi.fn();
		vi.spyOn(remixReact, 'useNavigate').mockReturnValue(navigateMock);
	});

	it('renders empty state when no games exist', () => {
		// Mock empty game history
		vi.spyOn(storage, 'getGameHistory').mockReturnValue([]);

		render(
			<MemoryRouter>
				<GameHistory />
			</MemoryRouter>,
		);

		expect(
			screen.getByText('No games found. Start a new game to see history here.'),
		).toBeInTheDocument();
		expect(storage.getGameHistory).toHaveBeenCalledTimes(1);
	});

	it('renders game history when games exist', () => {
		// Mock game history
		const mockGames: Game[] = [
			{
				id: '1',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				players: [
					{ id: '1', name: 'Alice' },
					{ id: '2', name: 'Bob' },
				],
				rounds: [],
				scoringRule: {
					type: 'standard' as ScoringRuleType,
					config: {
						exactBidBonus: 10,
						pointsPerTrick: 1,
						pointsForMissingBid: 'zero',
						name: 'Standard',
						description: 'Standard scoring',
					},
				},
				isComplete: false,
				maxRounds: 19,
				currentRound: 1,
			},
		];

		vi.spyOn(storage, 'getGameHistory').mockReturnValue(mockGames);

		render(
			<MemoryRouter>
				<GameHistory />
			</MemoryRouter>,
		);

		expect(screen.getByText('Alice, Bob')).toBeInTheDocument();
		expect(screen.getByText(/Round 1\/19/)).toBeInTheDocument();
		expect(screen.getByText('Scoring: Standard')).toBeInTheDocument();
		expect(storage.getGameHistory).toHaveBeenCalledTimes(1);
	});

	it('shows resume button for incomplete games', () => {
		const mockGames: Game[] = [
			{
				id: '1',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				players: [{ id: '1', name: 'Player 1' }],
				rounds: [],
				scoringRule: {
					type: 'standard' as ScoringRuleType,
					config: {
						exactBidBonus: 10,
						pointsPerTrick: 1,
						pointsForMissingBid: 'zero',
						name: 'Standard',
						description: 'Standard scoring',
					},
				},
				isComplete: false,
				maxRounds: 19,
				currentRound: 1,
			},
		];

		vi.spyOn(storage, 'getGameHistory').mockReturnValue(mockGames);

		render(
			<MemoryRouter>
				<GameHistory />
			</MemoryRouter>,
		);

		expect(screen.getByText('Resume')).toBeInTheDocument();
	});

	it('shows view button for completed games', () => {
		const mockGames: Game[] = [
			{
				id: '1',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				players: [{ id: '1', name: 'Player 1' }],
				rounds: [],
				scoringRule: {
					type: 'standard' as ScoringRuleType,
					config: {
						exactBidBonus: 10,
						pointsPerTrick: 1,
						pointsForMissingBid: 'zero',
						name: 'Standard',
						description: 'Standard scoring',
					},
				},
				isComplete: true,
				maxRounds: 19,
				currentRound: 19,
			},
		];

		vi.spyOn(storage, 'getGameHistory').mockReturnValue(mockGames);

		render(
			<MemoryRouter>
				<GameHistory />
			</MemoryRouter>,
		);

		expect(screen.getByText('View')).toBeInTheDocument();
	});

	it('displays winner information for completed games', () => {
		const mockGames: Game[] = [
			{
				id: '1',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				players: [
					{ id: '1', name: 'Player 1' },
					{ id: '2', name: 'Champion' },
				],
				rounds: [],
				scoringRule: {
					type: 'standard' as ScoringRuleType,
					config: {
						exactBidBonus: 10,
						pointsPerTrick: 1,
						pointsForMissingBid: 'zero',
						name: 'Standard',
						description: 'Standard scoring',
					},
				},
				isComplete: true,
				maxRounds: 19,
				currentRound: 19,
				winner: { id: '2', name: 'Champion' },
			},
		];

		vi.spyOn(storage, 'getGameHistory').mockReturnValue(mockGames);

		render(
			<MemoryRouter>
				<GameHistory />
			</MemoryRouter>,
		);

		expect(screen.getByText('Winner: Champion')).toBeInTheDocument();
		expect(screen.getByText(/Completed/)).toBeInTheDocument();
	});
});

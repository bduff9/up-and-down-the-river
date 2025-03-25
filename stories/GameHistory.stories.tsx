import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { GameHistory } from '../app/components/game-history';
import type { Game, ScoringRuleType } from '../app/lib/types';

// Mock games data
const mockGames: Game[] = [
	{
		id: '1',
		createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
		updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
		players: [
			{ id: '1', name: 'Alice' },
			{ id: '2', name: 'Bob' },
			{ id: '3', name: 'Carol' },
		],
		rounds: [
			{
				number: 1,
				cardsPerPlayer: 10,
				trumpSuit: 'hearts',
				playerResults: [
					{ playerId: '1', bid: 3, tricksTaken: 3, roundScore: 13 },
					{ playerId: '2', bid: 2, tricksTaken: 4, roundScore: 4 },
					{ playerId: '3', bid: 4, tricksTaken: 3, roundScore: 3 },
				],
			},
		],
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
		currentRound: 2,
	},
	{
		id: '2',
		createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
		updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
		players: [
			{ id: '1', name: 'Dave' },
			{ id: '2', name: 'Eve' },
			{ id: '3', name: 'Frank' },
			{ id: '4', name: 'Grace' },
		],
		rounds: [
			{
				number: 19,
				cardsPerPlayer: 10,
				trumpSuit: 'spades',
				playerResults: [
					{ playerId: '1', bid: 2, tricksTaken: 2, roundScore: 12 },
					{ playerId: '2', bid: 3, tricksTaken: 5, roundScore: 5 },
					{ playerId: '3', bid: 1, tricksTaken: 1, roundScore: 11 },
					{ playerId: '4', bid: 2, tricksTaken: 2, roundScore: 12 },
				],
			},
		],
		scoringRule: {
			type: 'common' as ScoringRuleType,
			config: {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'tricksOnly',
				name: 'Common',
				description: 'Common scoring variant',
			},
		},
		isComplete: true,
		maxRounds: 19,
		currentRound: 19,
		winner: { id: '2', name: 'Eve' },
	},
];

// Custom implementation of GameHistory that doesn't rely on storage.ts
// Instead of mocking the module, we'll reimplement the component with controlled data
const MockedGameHistory: React.FC<{ initialGames: Game[] }> = ({ initialGames }) => {
	const navigate = (path: string) => console.log(`[Mock] Navigating to ${path}`);
	const [games, setGames] = React.useState<Game[]>(initialGames);

	function handleResumeGame(gameId: string): void {
		navigate(`/games/${gameId}`);
	}

	function handleDeleteGame(gameId: string): void {
		if (window.confirm('Are you sure you want to delete this game?')) {
			setGames(games.filter((game) => game.id !== gameId));
		}
	}

	function handleClearAllGames(): void {
		if (
			window.confirm('Are you sure you want to delete ALL game history? This cannot be undone.')
		) {
			setGames([]);
		}
	}

	// Sort games by date (newest first)
	const sortedGames = React.useMemo(
		() =>
			[...games].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
		[games],
	);

	return (
		<div className="p-4 bg-white rounded-lg shadow">
			<div className="mb-4">
				<h2 className="text-xl font-bold">Game History</h2>
				<p className="text-gray-500">View and manage your previous games</p>
			</div>

			{sortedGames.length === 0 ? (
				<div className="text-center p-4 text-gray-500">
					No games found. Start a new game to see history here.
				</div>
			) : (
				<div className="space-y-4">
					<div className="grid gap-4">
						{sortedGames.map((game) => (
							<div
								key={game.id}
								className="border rounded-md p-4 flex flex-col md:flex-row justify-between gap-4"
							>
								<div>
									<div className="font-medium">{game.players.map((p) => p.name).join(', ')}</div>
									<div className="text-sm text-gray-500">
										{new Date(game.createdAt).toLocaleDateString()} •{' '}
										{game.isComplete ? 'Completed' : `Round ${game.currentRound}/${game.maxRounds}`}
									</div>
									<div className="text-sm mt-1">Scoring: {game.scoringRule.config.name}</div>
									{game.isComplete && game.winner && (
										<div className="text-sm mt-1 font-medium text-green-600">
											Winner: {game.winner.name}
										</div>
									)}
								</div>
								<div className="flex gap-2 self-end md:self-center">
									<button
										type="button"
										className="px-2 py-1 text-sm border rounded bg-white"
										onClick={() => handleResumeGame(game.id)}
									>
										{game.isComplete ? 'View' : 'Resume'}
									</button>
									<button
										type="button"
										className="px-2 py-1 text-sm border rounded bg-red-50 text-red-700"
										onClick={() => handleDeleteGame(game.id)}
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>

					{sortedGames.length > 0 && (
						<div className="pt-4 border-t mt-6">
							<button
								type="button"
								className="w-full py-2 bg-red-50 text-red-700 border border-red-200 rounded"
								onClick={handleClearAllGames}
							>
								Clear All Game History
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

// Define meta for the stories
const meta: Meta = {
	title: 'Game/GameHistory',
	component: GameHistory,
	parameters: {
		layout: 'centered',
		docs: {
			story: {
				inline: false,
				iframeHeight: 500,
			},
		},
	},
	decorators: [
		(Story) => (
			<div style={{ width: '600px' }}>
				<Story />
			</div>
		),
	],
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Story with games
export const WithGames: Story = {
	name: 'With Games',
	parameters: {
		docs: {
			description: 'Shows game history with two games',
		},
	},
	render: () => <MockedGameHistory initialGames={mockGames} />,
};

// Story showing empty state
export const EmptyHistory: Story = {
	name: 'Empty History',
	parameters: {
		docs: {
			description: 'Shows empty game history state',
		},
	},
	render: () => <MockedGameHistory initialGames={[]} />,
};

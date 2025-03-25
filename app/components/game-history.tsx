import { useNavigate } from '@remix-run/react';
import * as React from 'react';
import { clearAllGameData, deleteGameFromHistory, getGameHistory } from '~/lib/storage';
import type { Game } from '~/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export const GameHistory: React.FC = () => {
	const navigate = useNavigate();
	const [games, setGames] = React.useState<Game[]>(getGameHistory());

	function handleResumeGame(gameId: string): void {
		navigate(`/games/${gameId}`);
	}

	function handleDeleteGame(gameId: string): void {
		if (!confirm('Are you sure you want to delete this game?')) {
			return;
		}

		deleteGameFromHistory(gameId);
		setGames(getGameHistory());
	}

	function handleClearAllGames(): void {
		if (!confirm('Are you sure you want to delete ALL game history? This cannot be undone.')) {
			return;
		}

		clearAllGameData();
		setGames([]);
	}

	// Sort games by date (newest first)
	const sortedGames = [...games].sort(
		(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Game History</CardTitle>
				<CardDescription>View and manage your previous games</CardDescription>
			</CardHeader>
			<CardContent>
				{sortedGames.length === 0 ? (
					<div className="text-center p-4 text-muted-foreground">
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
										<div className="text-sm text-muted-foreground">
											{new Date(game.createdAt).toLocaleDateString()} •{' '}
											{game.isComplete
												? 'Completed'
												: `Round ${game.currentRound}/${game.maxRounds}`}
										</div>
										<div className="text-sm mt-1">Scoring: {game.scoringRule.config.name}</div>
										{game.isComplete && game.winner && (
											<div className="text-sm mt-1 font-medium text-green-600">
												Winner: {game.winner.name}
											</div>
										)}
									</div>
									<div className="flex gap-2 self-end md:self-center">
										<Button variant="outline" size="sm" onClick={() => handleResumeGame(game.id)}>
											{game.isComplete ? 'View' : 'Resume'}
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDeleteGame(game.id)}
										>
											Delete
										</Button>
									</div>
								</div>
							))}
						</div>

						{sortedGames.length > 0 && (
							<div className="pt-4 border-t mt-6">
								<Button variant="destructive" onClick={handleClearAllGames} className="w-full">
									Clear All Game History
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

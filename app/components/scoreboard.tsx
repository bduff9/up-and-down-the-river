import type * as React from 'react';
import { calculateTotalScore, madeBidExactly } from '~/lib/scoring';
import type { Game, PlayerRoundResult } from '~/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type ScoreboardProps = {
	game: Game;
};

export const Scoreboard: React.FC<ScoreboardProps> = ({ game }) => {
	const { players, rounds } = game;

	// Calculate player scores and sort by total score (highest first)
	const playerScores = players
		.map((player) => {
			const playerResults = rounds.flatMap((round) =>
				round.playerResults.filter((result) => result.playerId === player.id),
			);

			const totalScore = calculateTotalScore(playerResults);

			return {
				player,
				results: playerResults,
				totalScore,
			};
		})
		.sort((a, b) => b.totalScore - a.totalScore);

	// Function to get a player's result for a specific round
	function getPlayerRoundResult(
		playerId: string,
		roundNumber: number,
	): PlayerRoundResult | undefined {
		const round = rounds.find((r) => r.number === roundNumber);
		return round?.playerResults.find((result) => result.playerId === playerId);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Scoreboard</CardTitle>
				<CardDescription>
					{game.isComplete ? 'Game completed' : `Round ${game.currentRound} of ${game.maxRounds}`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b">
								<th className="text-left py-2 pr-4 font-medium">Player</th>
								{rounds.map((round) => (
									<th key={round.number} className="text-center p-2 min-w-12 font-medium">
										{round.number}
									</th>
								))}
								<th className="text-center p-2 font-medium">Total</th>
							</tr>
						</thead>
						<tbody>
							{playerScores.map(({ player, totalScore }) => (
								<tr key={player.id} className="border-b last:border-0">
									<td className="py-2 pr-4 font-medium">
										{player.name}
										{playerScores[0].player.id === player.id && (
											<span className="ml-1 text-xs text-amber-500">★</span>
										)}
									</td>

									{rounds.map((round) => {
										const result = getPlayerRoundResult(player.id, round.number);
										if (!result)
											return (
												<td key={round.number} className="text-center p-2">
													-
												</td>
											);

										const madeBid = madeBidExactly(result.bid, result.tricksTaken);

										return (
											<td
												key={round.number}
												className={`text-center p-2 ${madeBid ? 'text-green-600' : 'text-destructive'}`}
												title={`Bid: ${result.bid}, Took: ${result.tricksTaken}`}
											>
												{result.roundScore}
											</td>
										);
									})}

									<td className="text-center p-2 font-bold">{totalScore}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{game.isComplete && (
					<div className="mt-4 text-center font-medium">Winner: {playerScores[0].player.name}!</div>
				)}
			</CardContent>
		</Card>
	);
};

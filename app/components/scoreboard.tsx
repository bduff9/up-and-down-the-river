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

	// Find the highest score
	const highestScore = playerScores.length > 0 ? playerScores[0].totalScore : 0;

	// Don't show stars if all players have zero points
	const shouldShowStars = highestScore > 0;

	// Determine leading players (could be multiple in case of a tie)
	const leadingPlayerIds = shouldShowStars
		? playerScores.filter((p) => p.totalScore === highestScore).map((p) => p.player.id)
		: [];

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
			<CardContent className="px-0 sm:px-6">
				<div className="overflow-x-auto -mx-1 px-1">
					<table className="w-full text-xs sm:text-sm">
						<thead>
							<tr className="border-b">
								<th className="text-left py-1 sm:py-2 px-2 sm:pr-4 font-medium whitespace-nowrap">
									Player
								</th>
								{rounds.map((round) => (
									<th
										key={round.number}
										className="text-center p-1 sm:p-2 min-w-8 sm:min-w-12 font-medium"
									>
										Rd. {round.number}
									</th>
								))}
								<th className="text-center p-1 sm:p-2 font-medium whitespace-nowrap">Total</th>
							</tr>
						</thead>
						<tbody>
							{playerScores.map(({ player, totalScore }) => (
								<tr key={player.id} className="border-b last:border-0">
									<td className="py-1 sm:py-2 px-2 sm:pr-4 font-medium whitespace-nowrap">
										{player.name}
										{leadingPlayerIds.includes(player.id) && (
											<span className="ml-1 text-xs text-amber-500" title="Current leader">
												★
											</span>
										)}
									</td>

									{rounds.map((round) => {
										const result = getPlayerRoundResult(player.id, round.number);
										if (!result)
											return (
												<td key={round.number} className="text-center p-1 sm:p-2">
													-
												</td>
											);

										const madeBid =
											result.bid !== null && madeBidExactly(result.bid, result.tricksTaken);

										return (
											<td
												key={round.number}
												className={`text-center p-1 sm:p-2 ${madeBid ? 'text-green-600' : 'text-destructive'}`}
												title={`Bid: ${result.bid}, Took: ${result.tricksTaken}`}
											>
												{result.roundScore}
											</td>
										);
									})}

									<td className="text-center p-1 sm:p-2 font-bold">{totalScore}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{game.isComplete && shouldShowStars && (
					<div className="mt-4 text-center font-medium">
						Winner: {playerScores[0].player.name}
						<span className="ml-1 text-amber-500">★</span>!
					</div>
				)}

				{game.isComplete && !shouldShowStars && (
					<div className="mt-4 text-center font-medium">
						Game complete! All players tied with 0 points.
					</div>
				)}
			</CardContent>
		</Card>
	);
};

import { generateId } from './client-utils';
import { getScoringRuleConfig } from './scoring';
import type { Game, Player, Round, RoundPattern, ScoringRule } from './types';

/**
 * Calculate the game structure based on player count
 */
export function calculateGameStructure(
		playerCount: number,
		customMaxCards?: number,
		roundPattern: RoundPattern = 'down-up',
	): {
		maxCardsPerPlayer: number;
		totalRounds: number;
		roundsStructure: number[];
	} {
		let maxCardsPerPlayer: number;

		// Use custom max cards if provided, otherwise determine by player count
		if (customMaxCards !== undefined) {
			maxCardsPerPlayer = customMaxCards;
		} else {
			// Determine maximum cards per player based on player count
			if (playerCount <= 5) {
				maxCardsPerPlayer = 10;
			} else if (playerCount === 6) {
				maxCardsPerPlayer = 8;
			} else {
				maxCardsPerPlayer = 7;
			}
		}

		// Calculate descending and ascending rounds
		// This creates rounds from max cards down to 1
		const descendingRounds = Array.from(
			{ length: maxCardsPerPlayer },
			(_, i) => maxCardsPerPlayer - i,
		);

		// This creates rounds from 2 up to max cards
		const ascendingRounds = Array.from({ length: maxCardsPerPlayer - 1 }, (_, i) => i + 2);

		// Create round structures based on pattern
		let roundsStructure: number[];
		if (roundPattern === 'down-up') {
			// Down-Up: Max -> 1 -> Max
			roundsStructure = [...descendingRounds, 1, ...ascendingRounds];
		} else {
			// Up-Down: 1 -> Max -> Max -> 1
			// Include max cards twice - once when going up and once when going down
			roundsStructure = [
				1,
				...ascendingRounds,
				maxCardsPerPlayer, // Add max card again to ensure it appears twice
				...descendingRounds.slice(1),
			];
		}

		return {
			maxCardsPerPlayer,
			totalRounds: roundsStructure.length,
			roundsStructure,
		};
	}

/**
 * Create a new game
 */
export function createGame(
		players: Player[],
		scoringRuleType: string,
		customMaxCards?: number,
		roundPattern: RoundPattern = 'down-up',
	): Game {
		const { totalRounds, roundsStructure } = calculateGameStructure(
			players.length,
			customMaxCards,
			roundPattern,
		);

		const scoringRule: ScoringRule = {
			type: scoringRuleType as 'standard' | 'simple' | 'common' | 'penalty' | 'custom',
			config: getScoringRuleConfig(scoringRuleType),
		};

		return {
			id: generateId(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			players,
			rounds: [],
			scoringRule,
			isComplete: false,
			maxRounds: totalRounds,
			currentRound: 1,
			customMaxCards,
			roundPattern,
		};
	}

/**
 * Create a new round
 */
export function createRound(roundNumber: number, game: Game): Round {
	// If the game has a stored customMaxCards value, use it directly
	const { roundsStructure } = calculateGameStructure(
		game.players.length,
		game.customMaxCards,
		game.roundPattern,
	);

	// Ensure round number is within valid range
	const safeRoundNumber = Math.min(Math.max(1, roundNumber), roundsStructure.length);
	// We need to use index (safeRoundNumber - 1) to get the correct cards for this round
	const cardsForRound = roundsStructure[safeRoundNumber - 1] || 1;

	return {
		number: roundNumber,
		cardsPerPlayer: cardsForRound,
		trumpSuit: null,
		playerResults: game.players.map((player) => ({
			playerId: player.id,
			bid: null,
			tricksTaken: 0,
			roundScore: 0,
		})),
	};
}

/**
 * Check if all players have bid in the current round
 */
export function allPlayersBidded(round: Round): boolean {
	return round.playerResults.every((result) => result.bid !== null);
}

/**
 * Check if all players have played their tricks in the current round
 */
export function allPlayersPlayedTricks(round: Round): boolean {
	return round.playerResults.every((result) => result.tricksTaken >= 0);
}

/**
 * Get the next round number
 */
export function getNextRoundNumber(currentRound: number, maxRounds: number): number | null {
	return currentRound < maxRounds ? currentRound + 1 : null;
}

/**
 * Check if a round is complete
 */
export function isRoundComplete(round: Round): boolean {
	return allPlayersBidded(round) && allPlayersPlayedTricks(round);
}

/**
 * Check if a game is complete
 */
export function isGameComplete(game: Game): boolean {
	return (
		game.currentRound === game.maxRounds &&
		game.rounds.length === game.maxRounds &&
		isRoundComplete(game.rounds[game.rounds.length - 1])
	);
}

/**
 * Get the winner of a game
 */
export function getGameWinner(game: Game): Player | undefined {
	if (!isGameComplete(game)) {
		return undefined;
	}

	const playerScores = game.players.map((player) => {
		const totalScore = game.rounds.reduce((sum, round) => {
			const playerResult = round.playerResults.find((result) => result.playerId === player.id);
			return sum + (playerResult?.roundScore || 0);
		}, 0);

		return { player, totalScore };
	});

	playerScores.sort((a, b) => b.totalScore - a.totalScore);

	return playerScores[0]?.player;
}

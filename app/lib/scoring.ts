import type { PlayerRoundResult, ScoringRuleConfig } from './types';

/**
 * Calculates the score for a player in a round based on the chosen scoring rule.
 */
export function calculateRoundScore(
	bid: number,
	tricksTaken: number,
	scoringRule: ScoringRuleConfig,
): number {
	const exactBid = bid === tricksTaken;

	if (exactBid) {
		return scoringRule.exactBidBonus + tricksTaken * scoringRule.pointsPerTrick;
	}

	switch (scoringRule.pointsForMissingBid) {
		case 'zero':
			return 0;
		case 'tricksOnly':
			return tricksTaken * scoringRule.pointsPerTrick;
		case 'penalty': {
			const difference = Math.abs(bid - tricksTaken);
			return -difference * (scoringRule.penaltyPerTrick || 1);
		}
		default:
			return 0;
	}
}

/**
 * Get predefined scoring rule configuration by type
 */
export function getScoringRuleConfig(type: string): ScoringRuleConfig {
	switch (type) {
		case 'standard':
			return {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'zero',
				name: 'Standard',
				description: '10 points + 1 per trick for exact bid, 0 for missing bid',
			};
		case 'simple':
			return {
				exactBidBonus: 10,
				pointsPerTrick: 0,
				pointsForMissingBid: 'zero',
				name: 'Simple',
				description: '10 points + number of tricks bid for exact bid, 0 for missing bid',
			};
		case 'common':
			return {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'tricksOnly',
				name: 'Common',
				description: '1 point per trick taken, 10 point bonus for exact bid',
			};
		case 'penalty':
			return {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'penalty',
				penaltyPerTrick: 1,
				name: 'Penalty',
				description:
					'10 points + 1 per trick for exact bid, -1 per trick over/under for missing bid',
			};
		default:
			return {
				exactBidBonus: 10,
				pointsPerTrick: 1,
				pointsForMissingBid: 'zero',
				name: 'Standard',
				description: '10 points + 1 per trick for exact bid, 0 for missing bid',
			};
	}
}

/**
 * Calculate total score for a player across all rounds
 */
export function calculateTotalScore(playerResults: PlayerRoundResult[]): number {
	return playerResults.reduce((total, result) => total + result.roundScore, 0);
}

/**
 * Determine if a player made their bid exactly
 */
export function madeBidExactly(bid: number, tricksTaken: number): boolean {
	return bid === tricksTaken;
}

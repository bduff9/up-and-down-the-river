import { type } from 'arktype';
import type {
	Game,
	Player,
	PlayerRoundResult,
	Round,
	ScoringRule,
	ScoringRuleConfig,
} from './types';

/**
 * Validation schema for Player
 */
export const playerSchema = type({
	id: 'string',
	name: 'string',
});

/**
 * Validation schema for PlayerRoundResult
 */
export const playerRoundResultSchema = type({
	playerId: 'string',
	bid: 'number>=0',
	tricksTaken: 'number>=0',
	roundScore: 'number',
});

/**
 * Validation schema for Round
 */
export const roundSchema = type({
	number: 'number>=1',
	cardsPerPlayer: 'number>=1',
	'trumpSuit?': 'string | null',
	playerResults: 'object[]',
});

/**
 * Validation schema for ScoringRuleConfig
 */
export const scoringRuleConfigSchema = type({
	exactBidBonus: 'number>=0',
	pointsPerTrick: 'number>=0',
	pointsForMissingBid: "'zero' | 'tricksOnly' | 'penalty'",
	'penaltyPerTrick?': 'number>=0',
	name: 'string',
	description: 'string',
});

/**
 * Validation schema for ScoringRule
 */
export const scoringRuleSchema = type({
	type: "'standard' | 'simple' | 'common' | 'penalty' | 'custom'",
	config: 'object',
});

/**
 * Validation schema for Game
 */
export const gameSchema = type({
	id: 'string',
	createdAt: 'string',
	updatedAt: 'string',
	players: 'object[]',
	rounds: 'object[]',
	scoringRule: 'object',
	isComplete: 'boolean',
	maxRounds: 'number>=1',
	currentRound: 'number>=1',
	'winner?': 'object',
});

/**
 * Validate player data
 */
export function validatePlayer(data: unknown): Player | Error {
	const result = playerSchema(data);
	return result instanceof Error ? result : (result as Player);
}

/**
 * Validate player round result data
 */
export function validatePlayerRoundResult(data: unknown): PlayerRoundResult | Error {
	const result = playerRoundResultSchema(data);
	return result instanceof Error ? result : (result as PlayerRoundResult);
}

/**
 * Validate round data
 */
export function validateRound(data: unknown): Round | Error {
	const result = roundSchema(data);
	return result instanceof Error ? result : (result as Round);
}

/**
 * Validate scoring rule config data
 */
export function validateScoringRuleConfig(data: unknown): ScoringRuleConfig | Error {
	const result = scoringRuleConfigSchema(data);
	return result instanceof Error ? result : (result as ScoringRuleConfig);
}

/**
 * Validate scoring rule data
 */
export function validateScoringRule(data: unknown): ScoringRule | Error {
	const result = scoringRuleSchema(data);
	return result instanceof Error ? result : (result as ScoringRule);
}

/**
 * Validate game data
 */
export function validateGame(data: unknown): Game | Error {
	const result = gameSchema(data);
	return result instanceof Error ? result : (result as Game);
}

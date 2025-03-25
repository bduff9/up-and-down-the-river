/**
 * Player model representing a game participant
 */
export type Player = {
	id: string;
	name: string;
};

/**
 * Result for a player in a specific round
 */
export type PlayerRoundResult = {
	playerId: string;
	bid: number;
	tricksTaken: number;
	roundScore: number;
};

/**
 * Round model representing a single round in the game
 */
export type Round = {
	number: number;
	cardsPerPlayer: number;
	trumpSuit: string | null;
	playerResults: PlayerRoundResult[];
};

/**
 * ScoringRuleType enum for predefined scoring rule types
 */
export type ScoringRuleType = 'standard' | 'simple' | 'common' | 'penalty' | 'custom';

/**
 * ScoringRuleConfig for defining how scores are calculated
 */
export type ScoringRuleConfig = {
	exactBidBonus: number;
	pointsPerTrick: number;
	pointsForMissingBid: 'zero' | 'tricksOnly' | 'penalty';
	penaltyPerTrick?: number; // Used only when pointsForMissingBid is "penalty"
	name: string;
	description: string;
};

/**
 * ScoringRule combining the type and configuration
 */
export type ScoringRule = {
	type: ScoringRuleType;
	config: ScoringRuleConfig;
};

/**
 * Game model representing a full game
 */
export type Game = {
	id: string;
	createdAt: string;
	updatedAt: string;
	players: Player[];
	rounds: Round[];
	scoringRule: ScoringRule;
	isComplete: boolean;
	maxRounds: number;
	currentRound: number;
	winner?: Player;
	customMaxCards?: number; // Store the max cards setting for custom games
};

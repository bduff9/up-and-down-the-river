import type { Game } from './types';
import { validateGame } from './validation';

// Storage keys
const CURRENT_GAME_KEY = 'upDownRiver_currentGame';
const GAME_HISTORY_KEY = 'upDownRiver_gameHistory';
const USER_PREFERENCES_KEY = 'upDownRiver_userPreferences';

// Helper to check if we're in a browser environment with localStorage available
export function isLocalStorageAvailable(): boolean {
	try {
		return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
	} catch (e) {
		return false;
	}
}

/**
 * Save current game to local storage
 */
export function saveCurrentGame(game: Game): void {
	try {
		if (!isLocalStorageAvailable()) return;
		const gameJson = JSON.stringify(game);
		localStorage.setItem(CURRENT_GAME_KEY, gameJson);
	} catch (error) {
		console.error('Error saving current game to local storage:', error);
	}
}

/**
 * Get current game from local storage
 */
export function getCurrentGame(): Game | null {
	try {
		if (!isLocalStorageAvailable()) return null;
		const gameJson = localStorage.getItem(CURRENT_GAME_KEY);
		if (!gameJson) return null;

		const game = JSON.parse(gameJson);
		const result = validateGame(game);

		if (result instanceof Error) {
			console.error('Invalid game data in local storage:', result);
			return null;
		}

		return result;
	} catch (error) {
		console.error('Error retrieving current game from local storage:', error);
		return null;
	}
}

/**
 * Save game to history
 */
export function saveGameToHistory(game: Game): void {
	try {
		if (!isLocalStorageAvailable()) return;
		const historyJson = localStorage.getItem(GAME_HISTORY_KEY);
		const history: Game[] = historyJson ? JSON.parse(historyJson) : [];

		// Check if game already exists in history
		const existingIndex = history.findIndex((g) => g.id === game.id);

		if (existingIndex >= 0) {
			// Update existing game
			history[existingIndex] = game;
		} else {
			// Add new game
			history.push(game);
		}

		localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(history));
	} catch (error) {
		console.error('Error saving game to history:', error);
	}
}

/**
 * Get all games from history
 */
export function getGameHistory(): Game[] {
	try {
		if (!isLocalStorageAvailable()) return [];
		const historyJson = localStorage.getItem(GAME_HISTORY_KEY);
		if (!historyJson) return [];

		const history = JSON.parse(historyJson);
		if (!Array.isArray(history)) return [];

		// Filter out invalid games
		return history.filter((game) => {
			const result = validateGame(game);
			return !(result instanceof Error);
		});
	} catch (error) {
		console.error('Error retrieving game history from local storage:', error);
		return [];
	}
}

/**
 * Delete a game from history
 */
export function deleteGameFromHistory(gameId: string): void {
	try {
		if (!isLocalStorageAvailable()) return;
		const historyJson = localStorage.getItem(GAME_HISTORY_KEY);
		if (!historyJson) return;

		const history: Game[] = JSON.parse(historyJson);
		const updatedHistory = history.filter((game) => game.id !== gameId);

		localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(updatedHistory));
	} catch (error) {
		console.error('Error deleting game from history:', error);
	}
}

/**
 * Clear all game data
 */
export function clearAllGameData(): void {
	try {
		if (!isLocalStorageAvailable()) return;
		localStorage.removeItem(CURRENT_GAME_KEY);
		localStorage.removeItem(GAME_HISTORY_KEY);
	} catch (error) {
		console.error('Error clearing game data from local storage:', error);
	}
}

/**
 * Save user preferences
 */
export function saveUserPreferences(preferences: Record<string, unknown>): void {
	try {
		if (!isLocalStorageAvailable()) return;
		localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
	} catch (error) {
		console.error('Error saving user preferences to local storage:', error);
	}
}

/**
 * Get user preferences
 */
export function getUserPreferences(): Record<string, unknown> {
	try {
		if (!isLocalStorageAvailable()) return {};
		const preferencesJson = localStorage.getItem(USER_PREFERENCES_KEY);
		return preferencesJson ? JSON.parse(preferencesJson) : {};
	} catch (error) {
		console.error('Error retrieving user preferences from local storage:', error);
		return {};
	}
}

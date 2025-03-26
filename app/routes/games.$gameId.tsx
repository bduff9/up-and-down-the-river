import { Link, useNavigate, useParams } from '@remix-run/react';
import * as React from 'react';
import { BidInput } from '~/components/bid-input';
import { RoundTracker } from '~/components/round-tracker';
import { Scoreboard } from '~/components/scoreboard';
import { TricksInput } from '~/components/tricks-input';
import { TrumpSuitSelector } from '~/components/trump-suit-selector';
import { Button } from '~/components/ui/button';
import { createRound, getGameWinner, getNextRoundNumber } from '~/lib/game-utils';
import { getCurrentGame, getGameHistory, saveCurrentGame, saveGameToHistory } from '~/lib/storage';
import type { Game, Round } from '~/lib/types';

const GamePage: React.FC = () => {
	const params = useParams();
	const navigate = useNavigate();
	const gameId = params.gameId || '';

	const [game, setGame] = React.useState<Game | null>(null);
	const [currentRound, setCurrentRound] = React.useState<Round | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [trumpSelectionPhase, setTrumpSelectionPhase] = React.useState(true);
	const [bidPhase, setBidPhase] = React.useState(false);

	// Load game data
	React.useEffect(() => {
		function loadGame(): void {
			// Try to load from current game first
			let gameData = getCurrentGame();

			// If not found or different ID, look in history
			if (!gameData || gameData.id !== gameId) {
				const history = getGameHistory();
				gameData = history.find((g) => g.id === gameId) || null;
			}

			if (!gameData) {
				setError('Game not found');
				setLoading(false);
				return;
			}

			if (gameData.rounds.length === 0 && gameData.currentRound !== 1) {
				// Ensure we're starting at round 1 for a new game
				gameData.currentRound = 1;
			}

			setGame(gameData);

			// Get current round
			const roundData = gameData.rounds.find((r) => r.number === gameData.currentRound);

			if (roundData) {
				setCurrentRound(roundData);

				if (roundData.trumpSuit === null) {
					// Determine if we're in trump selection, bid, or tricks phase
					// If no trump suit is selected, we're in trump selection phase
					setTrumpSelectionPhase(true);
					setBidPhase(false);
				} else {
					// Trump has been selected, we're past the trump selection phase
					setTrumpSelectionPhase(false);

					// Check if any player has a null bid (indicating bid not yet entered)
					const biddingIncomplete = roundData.playerResults.some((p) => p.bid === null);
					setBidPhase(biddingIncomplete);

					// If we're not in bidding phase and not in trump selection,
					// we must be in the tricks phase (which is the default)
				}
			} else {
				// Create a new round
				const newRound = createRound(gameData.currentRound, gameData);

				setCurrentRound(newRound);
				setTrumpSelectionPhase(true);
				setBidPhase(false);
			}

			setLoading(false);
		}

		loadGame();
	}, [gameId]);

	// Save trump suit
	function handleSaveTrumpSuit(updatedRound: Round): void {
		if (!game) return;

		// Update current round with trump suit
		const updatedGame = {
			...game,
			rounds: [...game.rounds.filter((r) => r.number !== updatedRound.number), updatedRound],
		};

		// Save to storage
		saveCurrentGame(updatedGame);
		saveGameToHistory(updatedGame);

		// Update state
		setGame(updatedGame);
		setCurrentRound(updatedRound);
		setTrumpSelectionPhase(false);
		setBidPhase(true);
	}

	// Save bids
	function handleSaveBids(updatedRound: Round): void {
		if (!game) return;

		// Update current round
		const updatedGame = {
			...game,
			rounds: [...game.rounds.filter((r) => r.number !== updatedRound.number), updatedRound],
		};

		// Save to storage
		saveCurrentGame(updatedGame);
		saveGameToHistory(updatedGame);

		// Update state
		setGame(updatedGame);
		setCurrentRound(updatedRound);
		setBidPhase(false);
	}

	// Save tricks and proceed to next round if needed
	function handleSaveTricks(updatedRound: Round): void {
		if (!game) return;

		// Update current round
		let updatedGame = {
			...game,
			rounds: [...game.rounds.filter((r) => r.number !== updatedRound.number), updatedRound],
		};

		// Check if we should advance to next round
		const nextRoundNumber = getNextRoundNumber(game.currentRound, game.maxRounds);

		if (nextRoundNumber) {
			// Advance to next round
			updatedGame = {
				...updatedGame,
				currentRound: nextRoundNumber,
			};

			// Create the next round if it doesn't exist
			const nextRound =
				updatedGame.rounds.find((r) => r.number === nextRoundNumber) ||
				createRound(nextRoundNumber, updatedGame);

			if (!updatedGame.rounds.some((r) => r.number === nextRoundNumber)) {
				updatedGame.rounds.push(nextRound);
			}

			setCurrentRound(nextRound);
			setTrumpSelectionPhase(true);
			setBidPhase(false);
		} else {
			// Game complete
			const winner = getGameWinner(updatedGame);
			updatedGame = {
				...updatedGame,
				isComplete: true,
			};

			// Only set winner if we have one
			if (winner) {
				updatedGame.winner = winner;
			}
		}

		// Save to storage
		saveCurrentGame(updatedGame);
		saveGameToHistory(updatedGame);

		// Update state
		setGame(updatedGame);
	}

	if (loading) {
		return <div className="container py-8">Loading game...</div>;
	}

	if (error || !game || !currentRound) {
		return (
			<div className="container py-8">
				<div className="text-destructive">{error || 'Game not found'}</div>
				<Button asChild className="mt-4">
					<Link to="/">Back to Home</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="container py-8 space-y-8 max-w-full px-4">
			<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h1 className="text-2xl font-bold">Game #{game.id.substring(0, 8)}</h1>
				<Button variant="outline" asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</header>

			<div className="grid gap-8 grid-cols-1 md:grid-cols-2">
				<div className="space-y-6 w-full overflow-hidden">
					<RoundTracker game={game} currentRound={currentRound} />

					{!game.isComplete && (
						<>
							{trumpSelectionPhase && (
								<TrumpSuitSelector round={currentRound} onSave={handleSaveTrumpSuit} />
							)}

							{bidPhase && (
								<BidInput players={game.players} round={currentRound} onSave={handleSaveBids} />
							)}

							{!trumpSelectionPhase && !bidPhase && (
								<TricksInput
									players={game.players}
									round={currentRound}
									scoringRuleConfig={game.scoringRule.config}
									onSave={handleSaveTricks}
								/>
							)}
						</>
					)}
				</div>

				<div className="w-full overflow-hidden">
					<Scoreboard game={game} />
				</div>
			</div>

			{game.isComplete && (
				<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
					<Button variant="outline" asChild className="w-full sm:w-auto">
						<Link to="/">Back to Home</Link>
					</Button>
					<Button asChild className="w-full sm:w-auto">
						<Link to="/new">Start New Game</Link>
					</Button>
				</div>
			)}
		</div>
	);
};

export default GamePage;

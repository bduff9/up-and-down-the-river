import { useNavigate } from '@remix-run/react';
import * as React from 'react';
import ScoringRuleSelector from '~/components/scoring-rule-selector';
import { generateId } from '~/lib/client-utils';
import { calculateGameStructure, createGame } from '~/lib/game-utils';
import { saveCurrentGame } from '~/lib/storage';
import type { Player, ScoringRuleType } from '~/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export const GameSetup: React.FC = () => {
	const navigate = useNavigate();
	const [playerCount, setPlayerCount] = React.useState(4);
	const [players, setPlayers] = React.useState<Player[]>([
		{ id: generateId(), name: '' },
		{ id: generateId(), name: '' },
		{ id: generateId(), name: '' },
		{ id: generateId(), name: '' },
	]);
	const [scoringRule, setScoringRule] = React.useState<ScoringRuleType>('standard');
	const [customizationMode, setCustomizationMode] = React.useState<'cards' | 'rounds'>('cards');
	const [customRoundsEnabled, setCustomRoundsEnabled] = React.useState(false);
	const [maxCardsPerPlayer, setMaxCardsPerPlayer] = React.useState(10);
	const [totalRoundsCount, setTotalRoundsCount] = React.useState(19);

	// Calculate total rounds based on current configuration
	const { totalRounds, roundsStructure } = React.useMemo(() => {
		// For direct rounds count mode
		if (customRoundsEnabled && customizationMode === 'rounds') {
			// Estimate max cards for display purposes based on total rounds
			const estimatedMaxCards = Math.floor((totalRoundsCount - 1) / 2);
			return calculateGameStructure(playerCount, estimatedMaxCards);
		}

		// For cards per player mode
		return calculateGameStructure(
			playerCount,
			customRoundsEnabled && customizationMode === 'cards' ? maxCardsPerPlayer : undefined,
		);
	}, [playerCount, customRoundsEnabled, maxCardsPerPlayer, customizationMode, totalRoundsCount]);

	// When player count changes, update default max cards
	React.useEffect(() => {
		if (!customRoundsEnabled) {
			const { maxCardsPerPlayer: defaultMax, totalRounds: defaultTotalRounds } =
				calculateGameStructure(playerCount);
			setMaxCardsPerPlayer(defaultMax);
			setTotalRoundsCount(defaultTotalRounds);
		}
	}, [playerCount, customRoundsEnabled]);

	function handlePlayerCountChange(value: string): void {
		const count = Number.parseInt(value, 10);
		if (Number.isNaN(count) || count < 3 || count > 7) {
			return;
		}

		setPlayerCount(count);

		// Adjust player array based on selected count
		if (count > players.length) {
			// Add players
			const newPlayers = [...players];
			for (let i = players.length; i < count; i++) {
				newPlayers.push({ id: generateId(), name: '' });
			}
			setPlayers(newPlayers);
		} else if (count < players.length) {
			// Remove players
			setPlayers(players.slice(0, count));
		}
	}

	function handlePlayerNameChange(index: number, name: string): void {
		const newPlayers = [...players];
		newPlayers[index] = { ...newPlayers[index], name };
		setPlayers(newPlayers);
	}

	function handleScoringRuleChange(value: string): void {
		setScoringRule(value as ScoringRuleType);
	}

	function handleMaxCardsChange(value: string): void {
		const max = Number.parseInt(value, 10);
		if (Number.isNaN(max) || max < 1 || max > 20) {
			return;
		}
		setMaxCardsPerPlayer(max);
	}

	function handleTotalRoundsChange(value: string): void {
		const rounds = Number.parseInt(value, 10);
		if (Number.isNaN(rounds) || rounds < 3 || rounds > 50) {
			return;
		}
		setTotalRoundsCount(rounds);
	}

	function handleSubmit(e: React.FormEvent): void {
		e.preventDefault();

		// Validate player names
		const emptyNameIndex = players.findIndex((p) => !p.name.trim());
		if (emptyNameIndex !== -1) {
			alert(`Please enter a name for Player ${emptyNameIndex + 1}`);
			return;
		}

		// Create game with custom settings
		let customMaxCards: number | undefined;

		if (customRoundsEnabled) {
			if (customizationMode === 'cards') {
				// Explicitly use the exact value the user selected
				customMaxCards = maxCardsPerPlayer;
			} else {
				// rounds mode
				// For rounds mode, we set max cards to produce the desired round count
				customMaxCards = Math.floor((totalRoundsCount - 1) / 2);
			}
		} else {
			customMaxCards = undefined; // Use the default based on player count
		}

		const game = createGame(players, scoringRule, customMaxCards);

		// Save to local storage
		saveCurrentGame(game);

		// Navigate to game page
		navigate(`/games/${game.id}`);
	}

	return (
		<Card className="w-full mx-auto">
			<CardHeader>
				<CardTitle>New Game Setup</CardTitle>
				<CardDescription>Set up a new Up and Down the River game</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="game-setup-form" onSubmit={handleSubmit}>
					<div className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="player-count">Number of Players</Label>
							<Select value={playerCount.toString()} onValueChange={handlePlayerCountChange}>
								<SelectTrigger id="player-count">
									<SelectValue placeholder="Select number of players" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="3">3 Players</SelectItem>
									<SelectItem value="4">4 Players</SelectItem>
									<SelectItem value="5">5 Players</SelectItem>
									<SelectItem value="6">6 Players</SelectItem>
									<SelectItem value="7">7 Players</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-4">
							<Label>Player Names</Label>
							{players.map((player, index) => (
								<div key={player.id} className="flex items-center gap-2">
									<Label htmlFor={`player-${index}`} className="w-24">
										Player {index + 1}
									</Label>
									<Input
										id={`player-${index}`}
										value={player.name}
										onChange={(e) => handlePlayerNameChange(index, e.target.value)}
										placeholder={`Enter name for Player ${index + 1}`}
									/>
								</div>
							))}
						</div>

						<div className="space-y-4 border-t pt-4">
							<div className="flex items-center justify-between">
								<Label htmlFor="custom-rounds" className="flex-grow">
									<div>Customize Game Length</div>
									<p className="text-sm text-muted-foreground">
										Adjust the number of rounds or cards per player
									</p>
								</Label>
								<Switch
									id="custom-rounds"
									checked={customRoundsEnabled}
									onCheckedChange={setCustomRoundsEnabled}
								/>
							</div>

							{customRoundsEnabled ? (
								<div className="space-y-3">
									<Tabs
										defaultValue="cards"
										value={customizationMode}
										onValueChange={(v: string) => setCustomizationMode(v as 'cards' | 'rounds')}
									>
										<TabsList className="grid w-full grid-cols-2">
											<TabsTrigger value="cards">Cards Per Player</TabsTrigger>
											<TabsTrigger value="rounds">Number of Rounds</TabsTrigger>
										</TabsList>
										<TabsContent value="cards" className="space-y-2 mt-3">
											<Label htmlFor="max-cards">Maximum Cards Per Player</Label>
											<Select
												value={maxCardsPerPlayer.toString()}
												onValueChange={handleMaxCardsChange}
											>
												<SelectTrigger id="max-cards">
													<SelectValue placeholder="Select maximum cards" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
														<SelectItem key={num} value={num.toString()}>
															{num} cards
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<p className="text-sm text-muted-foreground mt-1">
												This will create a total of {totalRounds} rounds
											</p>
										</TabsContent>
										<TabsContent value="rounds" className="space-y-2 mt-3">
											<Label htmlFor="total-rounds">Total Number of Rounds</Label>
											<Select
												value={totalRoundsCount.toString()}
												onValueChange={handleTotalRoundsChange}
											>
												<SelectTrigger id="total-rounds">
													<SelectValue placeholder="Select number of rounds" />
												</SelectTrigger>
												<SelectContent>
													{[3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33].map(
														(num) => (
															<SelectItem key={num} value={num.toString()}>
																{num} rounds
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
										</TabsContent>
									</Tabs>

									<div className="mt-2 p-2 bg-muted/20 rounded text-sm">
										<div className="font-medium mb-1">Round Structure:</div>
										<div className="flex flex-wrap gap-1">
											{roundsStructure.map((cards, index) => (
												<div
													key={`round-${index + 1}-${cards}`}
													className="w-6 h-6 flex items-center justify-center bg-muted/30 rounded text-xs"
													title={`Round ${index + 1}: ${cards} cards`}
												>
													{cards}
												</div>
											))}
										</div>
									</div>
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Using default: {maxCardsPerPlayer} max cards, {totalRounds} total rounds
								</p>
							)}
						</div>

						<ScoringRuleSelector value={scoringRule} onChange={handleScoringRuleChange} />
					</div>
				</form>
			</CardContent>
			<CardFooter>
				<Button type="submit" form="game-setup-form" className="w-full" variant="success">
					Start Game
				</Button>
			</CardFooter>
		</Card>
	);
};

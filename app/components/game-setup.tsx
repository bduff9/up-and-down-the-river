import { useNavigate } from '@remix-run/react';
import * as React from 'react';
import ScoringRuleSelector from '~/components/scoring-rule-selector';
import { generateId } from '~/lib/client-utils';
import { createGame } from '~/lib/game-utils';
import { saveCurrentGame } from '~/lib/storage';
import type { Player, ScoringRuleType } from '~/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

	function handleSubmit(e: React.FormEvent): void {
		e.preventDefault();

		// Validate player names
		const emptyNameIndex = players.findIndex((p) => !p.name.trim());
		if (emptyNameIndex !== -1) {
			alert(`Please enter a name for Player ${emptyNameIndex + 1}`);
			return;
		}

		// Create game
		const game = createGame(players, scoringRule);

		// Save to local storage
		saveCurrentGame(game);

		// Navigate to game page
		navigate(`/games/${game.id}`);
	}

	return (
		<Card className="w-full max-w-lg mx-auto">
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

						<ScoringRuleSelector value={scoringRule} onChange={handleScoringRuleChange} />
					</div>
				</form>
			</CardContent>
			<CardFooter>
				<Button type="submit" form="game-setup-form" className="w-full">
					Start Game
				</Button>
			</CardFooter>
		</Card>
	);
};

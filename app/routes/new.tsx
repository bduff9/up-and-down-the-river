import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import type * as React from 'react';
import { GameSetup } from '~/components/game-setup';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Game - Up and Down the River' },
		{
			name: 'description',
			content: 'Start a new Up and Down the River card game',
		},
	];
};

const NewGame: React.FC = () => {
	return (
		<div className="container py-8 space-y-8">
			<header className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">New Game</h1>
				<Button variant="outline" asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</header>

			<GameSetup />
		</div>
	);
};

export default NewGame;

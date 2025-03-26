import { Link } from '@remix-run/react';
import * as React from 'react';
import { GameHistory } from '~/components/game-history';
import { Button } from '~/components/ui/button';
import { isLocalStorageAvailable } from '~/lib/storage';

const Index: React.FC = () => {
	const [localStorageAvailable, setLocalStorageAvailable] = React.useState(false);

	React.useEffect(() => {
		setLocalStorageAvailable(isLocalStorageAvailable());
	}, []);

	return (
		<div className="container py-8 space-y-8">
			<header className="text-center space-y-4">
				<h1 className="text-3xl font-bold">Up and Down the River</h1>
				<p className="text-muted-foreground">Keep track of your card game scores</p>
			</header>

			<div className="flex justify-center">
				<Button asChild size="lg">
					<Link to="/new">Start New Game</Link>
				</Button>
			</div>

			<div className="flex justify-center">
				<Button asChild variant="outline">
					<Link to="/rules">Game Rules</Link>
				</Button>
			</div>

			{localStorageAvailable && <GameHistory />}
		</div>
	);
};

export default Index;

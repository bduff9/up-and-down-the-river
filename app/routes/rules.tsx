import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import type * as React from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Game Rules - Up and Down the River' },
		{
			name: 'description',
			content: 'Official rules for the Up and Down the River card game',
		},
	];
};

const Rules: React.FC = () => {
	return (
		<div className="container py-8 space-y-6">
			<header className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Game Rules</h1>
				<Button variant="outline" asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</header>

			<Card>
				<CardHeader>
					<CardTitle>Up and Down the River</CardTitle>
				</CardHeader>
				<CardContent className="prose max-w-none">
					<h2>Overview</h2>
					<p>
						"Up and Down the River" is a trick-taking card game where players bid on how many tricks
						they believe they can win in each hand. The key challenge is that players must win{' '}
						<em>exactly</em> the number of tricks they bid - no more and no fewer - to score maximum
						points. The game follows a pattern of dealing a decreasing number of cards and then an
						increasing number of cards (hence the name "Up and Down the River").
					</p>

					<h2>Players</h2>
					<ul>
						<li>
							<strong>Number of Players</strong>: 3-7 players (best with 4-6)
						</li>
						<li>
							<strong>Deck</strong>: Standard 52-card deck (no jokers)
						</li>
					</ul>

					<h2>Card Ranking</h2>
					<ul>
						<li>
							<strong>High to Low</strong>: A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2
						</li>
						<li>
							<strong>Trump</strong>: A suit designated for each hand that outranks all other suits
						</li>
					</ul>

					<h2>Game Structure</h2>
					<p>
						The game consists of multiple hands. The number of cards dealt to each player changes
						with each hand, following this pattern:
					</p>
					<ol>
						<li>Start with a set number of cards (depends on player count)</li>
						<li>Decrease by one card each hand until reaching one card per player</li>
						<li>Increase by one card each hand until returning to the starting number</li>
					</ol>

					<h3>Starting Card Count</h3>
					<p>The maximum number of cards dealt per player depends on the number of players:</p>
					<ul>
						<li>3 to 5 players: 10 cards each</li>
						<li>6 players: 8 cards each</li>
						<li>7 players: 7 cards each</li>
					</ul>

					<h3>Hand Sequence Examples</h3>
					<ul>
						<li>
							<strong>With 4 players</strong>: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8,
							9, 10 (19 hands total)
						</li>
						<li>
							<strong>With 7 players</strong>: 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7 (13 hands
							total)
						</li>
					</ul>

					<h2>Setup and Dealing</h2>
					<ol>
						<li>
							<strong>Choose First Dealer</strong>: Players draw cards; highest card deals first
						</li>
						<li>
							<strong>Deal Cards</strong>: Deal the appropriate number of cards for the current hand
						</li>
						<li>
							<strong>Determine Trump</strong>: Turn over the next card after dealing to determine
							the trump suit
						</li>
						<li>
							<strong>Trump Card Placement</strong>: Place the trump card face-up on top of the
							remaining deck
						</li>
					</ol>

					<h2>Game Play</h2>
					<h3>Bidding Phase</h3>
					<ol>
						<li>Bidding begins with the player to the left of the dealer and proceeds clockwise</li>
						<li>
							Each player must bid the exact number of tricks they think they will win (0 is a valid
							bid)
						</li>
						<li>
							The dealer bids last and has a special restriction: The dealer cannot bid a number
							that would make the total bids equal the total number of tricks available in the hand
						</li>
						<li>
							This "hook" ensures that at least one player will fail to make their bid in each hand
						</li>
						<li>Players can change their bid only if the next player has not yet bid</li>
					</ol>

					<h3>Playing Phase</h3>
					<ol>
						<li>The player to the left of the dealer leads the first trick</li>
						<li>Play proceeds clockwise</li>
						<li>Players must follow the suit led if possible</li>
						<li>If unable to follow suit, a player may play any card (including trump)</li>
						<li>
							Highest card of the suit led wins the trick, unless a trump is played, in which case
							the highest trump wins
						</li>
						<li>The winner of each trick leads the next trick</li>
						<li>Continue until all tricks are played</li>
					</ol>

					<h2>Scoring</h2>
					<p>There are several common scoring variations:</p>

					<h3>Standard Scoring</h3>
					<ul>
						<li>
							<strong>Making Exact Bid</strong>: 10 points + 1 point per trick taken
						</li>
						<li>
							<strong>Missing Bid</strong>: 0 points (regardless of how many tricks actually taken)
						</li>
					</ul>

					<h3>Simple Scoring</h3>
					<ul>
						<li>
							<strong>Making Exact Bid</strong>: 10 points + number of tricks bid (e.g., bidding 3
							and taking exactly 3 tricks scores 13 points)
						</li>
						<li>
							<strong>Missing Bid</strong>: 0 points
						</li>
					</ul>

					<h3>Common Scoring</h3>
					<ul>
						<li>
							<strong>All Players</strong>: 1 point per trick taken (regardless of bid)
						</li>
						<li>
							<strong>Making Exact Bid</strong>: Additional 10 point bonus
						</li>
					</ul>

					<h3>Penalty Scoring</h3>
					<ul>
						<li>
							<strong>Making Exact Bid</strong>: 10 points + 1 point per trick taken
						</li>
						<li>
							<strong>Missing Bid</strong>: -1 point per trick over or under the bid
						</li>
					</ul>

					<h2>Game End</h2>
					<p>
						The game ends after completing all hands in the sequence. The player with the highest
						total score wins.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default Rules;

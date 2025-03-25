import type { Preview } from '@storybook/react';
import React from 'react';
import '../stories/stories.css';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'light',
			values: [
				{
					name: 'light',
					value: 'hsl(0 0% 100%)',
				},
				{
					name: 'dark',
					value: 'hsl(240 10% 3.9%)',
				},
			],
		},
	},
	// Apply global styling context to all stories
	decorators: [
		(Story) => (
			<div className="p-4 bg-background text-foreground min-h-screen flex items-center justify-center">
				<div className="w-full max-w-3xl">
					<Story />
				</div>
			</div>
		),
	],
};

export default preview;

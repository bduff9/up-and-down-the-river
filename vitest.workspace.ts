import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';
import { defineWorkspace } from 'vitest/config';

const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Run both component tests and Storybook tests
export default defineWorkspace([
	// Regular component tests
	'vitest.config.ts',
	// Storybook tests using our custom Storybook Vite config
	{
		extends: '.storybook/vite.config.ts',
		plugins: [
			// The plugin will run tests for the stories defined in your Storybook config
			storybookTest({ configDir: path.join(dirname, '.storybook') }),
		],
		test: {
			name: 'storybook',
			browser: {
				enabled: true,
				headless: true,
				provider: 'playwright',
				instances: [{ browser: 'chromium' }],
			},
			setupFiles: ['.storybook/vitest.setup.ts'],
		},
	},
]);

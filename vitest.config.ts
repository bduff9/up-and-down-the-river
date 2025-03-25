import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react(), viteTsconfigPaths()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: ['./app/**/*.test.{ts,tsx}'],
		exclude: ['./app/components/ui/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/**',
				'build/**',
				'public/**',
				'**/*.d.ts',
				'**/*.config.ts',
				'vitest.setup.ts',
				'.storybook/**',
			],
		},
	},
});

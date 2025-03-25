import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	// Direct configuration of PostCSS without dynamic requires
	css: {
		postcss: './postcss.config.js',
	},
});

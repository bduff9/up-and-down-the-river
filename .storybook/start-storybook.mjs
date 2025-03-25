#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Create a temporary Vite config for Storybook that doesn't use dynamic requires
const tempViteConfig = `
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [tsconfigPaths()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});
`;

const tempViteConfigPath = path.join(projectRoot, '.temp-storybook-vite.config.js');

try {
	// Write temporary Vite config
	fs.writeFileSync(tempViteConfigPath, tempViteConfig);

	// Set environment variable to use our temporary config
	process.env.STORYBOOK_VITE_CONFIG = tempViteConfigPath;

	// Run Storybook with the temporary config
	execSync('npx storybook dev -p 6006', {
		stdio: 'inherit',
		env: process.env,
	});
} catch (error) {
	console.error('Error running Storybook:', error);
	process.exit(1);
} finally {
	// Clean up the temporary file
	try {
		if (fs.existsSync(tempViteConfigPath)) {
			fs.unlinkSync(tempViteConfigPath);
		}
	} catch (e) {
		console.error('Failed to clean up temporary file:', e);
	}
}

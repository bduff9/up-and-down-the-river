import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll } from 'vitest';

// Add any MSW handlers here
const server = setupServer();

// Start MSW server before tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Clean up after each test
afterEach(() => {
	cleanup(); // Clean up the DOM
	server.resetHandlers(); // Reset MSW handlers
});

// Close MSW server after all tests
afterAll(() => server.close());

// Mock localStorage for tests
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value.toString();
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

// Set up localStorage mock
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

// Suppress React 18 console errors related to act() during testing
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
	if (
		typeof args[0] === 'string' &&
		(args[0].includes('Warning: ReactDOM.render') ||
			args[0].includes('Warning: React.createElement') ||
			args[0].includes('act(...)'))
	) {
		return;
	}
	originalConsoleError(...args);
};

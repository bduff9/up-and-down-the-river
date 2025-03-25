/**
 * Generate a random UUID that works in both client and server environments
 */
export function generateId(): string {
	// Check if crypto.randomUUID is available (modern browsers and Node.js)
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	// Fallback implementation for older browsers
	// This is not cryptographically secure, but it's a fallback
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

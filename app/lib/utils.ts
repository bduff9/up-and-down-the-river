import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple class names and merge tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility for merging class names with Tailwind support
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

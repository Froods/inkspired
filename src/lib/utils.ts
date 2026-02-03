import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// This function allows you to merge tailwind classes
// and handle conditional logic cleanly.
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditional className utility — clsx wrapped in tailwind-merge so duplicate
 * Tailwind utilities resolve to the rightmost. Used by every shadcn component.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

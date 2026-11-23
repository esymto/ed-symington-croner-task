import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom doesn't implement scrollTo, which TanStack Router calls on navigation
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

afterEach(() => {
	cleanup();
});

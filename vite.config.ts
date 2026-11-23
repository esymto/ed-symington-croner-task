/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
	// Sub-path for GitHub Pages; the dev server stays at the root
	base: command === 'build' || isPreview ? '/ed-symington-croner-task/' : '/',
	plugins: [react(), tailwindcss()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
	},
}));

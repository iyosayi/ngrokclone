import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // discover every *.test.ts below __tests__ folders
        include: [
            'packages/*/tests/**/*.test.ts',
            'packages/*/src/**/__tests__/**/*.test.ts',
            'e2e/**/*.test.ts'],
        environment: 'node',
        // allow 10 s for integration/E2E startup
        testTimeout: 10_000,
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            reporter: ['text', 'lcov'],
        },
    },
}); 
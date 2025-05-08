const baseConfig = require('@orchestrator-ui/jest-config/jest-base.config.js');

module.exports = {
    ...baseConfig,
    rootDir: './',
    testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],

    // 👇 Override the transformer for TS/TSX files to use ts-jest
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
        '^.+\\.jsx?$': 'babel-jest',
    },

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};

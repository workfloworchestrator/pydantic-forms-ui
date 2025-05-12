const baseConfig = require('@orchestrator-ui/jest-config/jest-base.config.js');

module.exports = {
    ...baseConfig,
    rootDir: './',
    testMatch: ['**/*.spec.ts', '**/*.spec.tsx'],

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

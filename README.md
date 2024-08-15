# TSinjex

## Configuration

### Jest

#### Example jest setup

```ts
module.exports = {
    setupFilesAfterEnv: ['./scripts/jest.setup.js'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(test).ts'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1', // Map src to the source folder
        '^ts-injex$': '<rootDir>/node_modules/ts-injex/src', // Map ts-injex to the source folder
    },
    transformIgnorePatterns: [
        'node_modules/(?!ts-injex)' // **Dont** ignore ts-injex on preset `ts-jest`
    ],
};
```
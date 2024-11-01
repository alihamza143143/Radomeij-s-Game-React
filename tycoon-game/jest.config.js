module.exports = {
    roots: ['<rootDir>/test'],
    testMatch: ['**/*.test.ts?(x)'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@test/(.*)$': '<rootDir>/test/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
  };
  
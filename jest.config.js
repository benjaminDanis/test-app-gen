require('dotenv').config({ path: '.env.development' });
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/*$': '<rootDir>/*',
    '^@submodules/*$': '<rootDir>/src/submodules/*',
    '^@/src/testSuites/(.*)$': '<rootDir>/src/testSuites/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',

  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts}'],
};

module.exports = createJestConfig(customJestConfig);

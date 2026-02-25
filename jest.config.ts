import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@store$': '<rootDir>/src/services/store',
    '^@slices$': '<rootDir>/src/services/slices'
  },
  transform: {
    '^.+\\.[tj][sx]?$': ['ts-jest', {}]
  }
};

export default config;
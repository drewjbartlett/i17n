module.exports = {
  verbose: true,
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/?(*.)+(spec|test).(ts|js)?(x)'],
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
};

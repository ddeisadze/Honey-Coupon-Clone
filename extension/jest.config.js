module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['./src/__tests__/jest.setup.js'],

  };
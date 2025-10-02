// jest.config.js
export default {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  // La siguiente línea es crucial para que Jest funcione con ES Modules
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
   testMatch: [
    "**/test/**/*.test.ts"
  ],
};
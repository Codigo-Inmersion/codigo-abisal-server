
// import type { Config } from "jest";

// const config: Config = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   testMatch: ["**/tests/**/*.test.ts"],
//   verbose: true,
//   // Asegura que NODE_ENV=test y cargue .env.test en los tests
//   setupFiles: ["<rootDir>/tests/setup-env.ts"],
// };

// export default config;

// jest.config.cjs
export default {
  preset: "ts-jest/presets/default-esm", // usa ts-jest con ESM
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true
    }
  }
};


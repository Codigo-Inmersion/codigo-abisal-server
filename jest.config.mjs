

// 1) Exporto en ESM porque tu proyecto es ESM (type: module / NodeNext)
export default {
  // 2) Preset de ts-jest para ESM
  preset: "ts-jest/presets/default-esm",

  // 3) Entorno de Node
  testEnvironment: "node",

  // 4) Fuerzo a ts-jest a ESM explícito
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "./tsconfig.json"
      }
    ]
  },

  // 5) Trata .ts como módulos ESM
  extensionsToTreatAsEsm: [".ts"],

  // 6) Arreglo común: si importas con sufijo .js en código TS,
  //    mapea a la ruta sin .js para que Jest lo resuelva bien.
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
 setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  // 7) Dónde están tus tests
  testMatch: ["**/test/**/*.test.ts"]
};

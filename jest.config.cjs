// jest.config.cjs

/** Config mínima de Jest con ts-jest (sin ESM para no liarnos) */
module.exports = {
  // 1) Usamos ts-jest para transformar TypeScript a JS dentro de Jest
  preset: "ts-jest",
  // 2) Los tests corren en Node
  testEnvironment: "node"
};

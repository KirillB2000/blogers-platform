/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.spec.ts", "**/__tests__/**/*.test.ts"],
  setupFiles: ["<rootDir>/__tests__/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
    "^.+\\.jsx?$": ["ts-jest", {}], // Заставляем ts-jest переваривать JS (для Inversify)
  },
  transformIgnorePatterns: [
    "node_modules/(?!(\\.pnpm|inversify|@inversifyjs)/)",
  ],
};

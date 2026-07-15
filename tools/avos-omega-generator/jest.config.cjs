module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/test", "<rootDir>/tests"],
  testMatch: [
    "**/?(*.)+(spec|test).[tj]s",
    "**/__tests__/**/*.[tj]s"
  ],
  moduleFileExtensions: ["ts", "js", "json"],
  passWithNoTests: true,
  clearMocks: true,
};
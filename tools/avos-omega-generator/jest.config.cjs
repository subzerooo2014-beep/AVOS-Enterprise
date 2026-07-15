const fs = require("fs");
const path = require("path");

const candidateRoots = ["src", "test", "tests", "__tests__"]
  .map((name) => path.join(__dirname, name))
  .filter((directory) => fs.existsSync(directory));

module.exports = {
  testEnvironment: "node",
  roots: candidateRoots.length > 0 ? candidateRoots : [__dirname],
  testMatch: [
    "**/?(*.)+(spec|test).js",
    "**/__tests__/**/*.js"
  ],
  moduleFileExtensions: ["js", "json"],
  passWithNoTests: true,
  clearMocks: true,
};
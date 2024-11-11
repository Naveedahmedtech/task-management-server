const tsConfigPaths = require("tsconfig-paths");
const tsConfig = require("./tsconfig.json");

const baseUrl = "./dist"; // Path to the compiled files
tsConfigPaths.register({
  baseUrl: baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

// Load the compiled entry point
require("./dist/server.js"); // Adjust the path as necessary

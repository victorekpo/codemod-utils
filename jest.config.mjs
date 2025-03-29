// Jest needs to be properly configured to support ESM.
// Jest needs to be explicitly told to handle ESM using Node.js native ESM support.
// Why transform: {}? It disables Jest’s default transformation, which is needed since we are running Jest in ESM mode.
export default {
  preset: "ts-jest/presets/default-esm", // Use ts-jest preset for ESM support
  testEnvironment: "node", // Node.js test environment
  extensionsToTreatAsEsm: [".ts"], // Treat .ts and .mjs files as ESM
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }], // Transform .ts and .tsx files using ts-jest with ESM
  },
  transformIgnorePatterns: [
    '/node_modules/(?!got/.*)', // Ensure `got` is transformed correctly
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Handle .js extensions correctly
  },
};

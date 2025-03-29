import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from "node:path";
import {builtinModules, createRequire} from "node:module";

// Read the package.json
const require = createRequire(import.meta.url);
const pkg = require(resolve("./package.json"));

// Get dependencies and peerDependencies from package.json
const external = [
  ...builtinModules,
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.bundleDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default {
  external,
  input: ['src/index.ts'], // Entry file for your library
  output: [
    {
      dir: 'dist',  // CommonJS output for Node.js
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      interop: "compat",
      entryFileNames: '[name].cjs', // Output files will have .cjs extension
    },
    {
      dir: 'dist',  // ESM output for modern JS apps
      format: 'esm',
      sourcemap: true,
      preserveModules: true,
      entryFileNames: '[name].mjs', // Output files will have .mjs extension
    },
  ],
  plugins: [
    nodeResolve(), // Resolves node_modules for ESM
    commonjs(), // Converts CommonJS to ESM
    typescript(), // Handle TypeScript files
  ],
};

import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'node:fs';

// Read the package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// Get dependencies and peerDependencies from package.json
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
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

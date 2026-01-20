import json from '@rollup/plugin-json';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    json(),
    ...plugins
  ];
}

const srcEntry = './src/migrateDiagram.js';

export default [
  {
    input: srcEntry,
    output: [
      { file: pkg.exports['.'], format: 'es' }
    ],
    external: [
      'dmn-moddle',
      'ids',
      'min-dash'
    ],
    plugins: pgl()
  }
];
import json from 'rollup-plugin-json';

export default {
  input: 'src/main.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [ json() ]
};
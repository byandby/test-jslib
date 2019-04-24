import json from 'rollup-plugin-json';

export default {
  input: 'src/main.js',
  
  output: {
    name: 'test-jslib',
    file: 'index.js',
    format: 'umd'
  },

  plugins: [ json() ],

  watch: {
    include: './src/*'
  }
};
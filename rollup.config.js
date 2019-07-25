import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default {
  input: 'src/index.js',

  output: {
    name: 'test-jslib',
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    json(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**', // Default: undefined
      // these values can also be regular expressions
      // include: /node_modules/

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)

      // if true then uses of `global` won't be dealt with by this plugin

      // if false then skip sourceMap generation for CommonJS modules

      // explicitly specify unresolvable named exports
      // (see below for more details)

      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
    }),
  ],

  watch: {
    include: './src/*',
  },
}

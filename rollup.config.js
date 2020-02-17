import path from 'path'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  external: ['react'],
  input: path.join(__dirname, 'index.js'),
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
  output: [
    {
      file: 'dist/index.es.js',
      format: 'es',
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named',
    },
    {
      name: 'useMultiState',
      file: 'dist/index.umd.js',
      format: 'iife',
      exports: 'named',
      globals: {
        react: 'React',
      },
    },
  ],
}

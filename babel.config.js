module.exports = {
  env: {
    test: {
      presets: ['@babel/env', '@babel/react'],
      plugins: [],
    },
  },
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
}

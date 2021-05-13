module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3',
        useBuiltIns: 'usage',
      },
    ],
    [
      '@babel/preset-react',
      {
        development: process.env.NODE_ENV === 'development',
      },
    ],
  ],
};

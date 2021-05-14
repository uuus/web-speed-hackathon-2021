module.exports = {
  darkMode: false,
  purge: {
    enabled: true,
    content: ['./src/**/!(*.d).{ts,js,jsx,tsx}'],
    fontFace: true,
  }
};

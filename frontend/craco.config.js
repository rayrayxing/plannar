module.exports = {
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        '/node_modules/(?!date-fns|@mui)/', 
        '^.+\\.module\\.(css|sass|scss)$', 
      ];
      return jestConfig;
    },
  },
  style: {
    postcssOptions: {
      plugins: [
        require('@tailwindcss/postcss'),
      ],
    },
  },
};
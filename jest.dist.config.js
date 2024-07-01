module.exports = {
    roots: ['<rootDir>/dist'],
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.js$',
    moduleFileExtensions: ['js', 'json', 'node'],
    collectCoverageFrom: ['<rootDir>/dist/**/*.{js}'],
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  };
  
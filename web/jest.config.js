const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  globals: {
    '__TS_CONFIG__': {
      'target': 'es6',
      'module': 'commonjs',
      'moduleResolution': 'node'
    },
    'ts-jest': {
      'tsConfigFile': 'src/tsconfig.spec.json'
    },
    '__TRANSFORM_HTML__': true
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|js)$',
  setupFilesAfterEnv: [
    '<rootDir>/src/setupJest.ts'
  ],
  transform: {
    '^.+\\.(ts|html)$': '<rootDir>/node_modules/jest-preset-angular/preprocessor.js',
  },
  "coverageReporters": [
    "html"
  ],
  transformIgnorePatterns: [
    'node_modules/(?!@ngrx)',
    '/cypress/'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/**/*-messages.{ts}',
    '!src/**/*.actions.{ts}',
    '!src/**/*.index.{ts}',
    '!src/**/models/*.{ts}',
    '!src/test/**/*.{ts}',
    '!src/typings.d.ts'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    'src/app/*.{js}',
    '/cypress/**'
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  moduleNameMapper: {
    "app/(.*)": "<rootDir>/src/app/$1",
    "auth/(.*)": "<rootDir>/src/auth/$1",
    // "invoicing/(.*)": "<rootDir>/src/invoicing/$1",
    "shared/(.*)": "<rootDir>/src/shared/$1",
    "storage/(.*)": "<rootDir>/src/storage/$1",
    "@common/(.*)": "<rootDir>/src/app/common/$1",
  }
};



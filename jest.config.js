module.exports = {
  testEnvironment: 'jsdom',

  // Coleta cobertura somente dos arquivos de lógica de negócio
  collectCoverageFrom: [
    'app.js',
    '!node_modules/**',
    '!scripts/**',
  ],

  // Limiares de cobertura mínima obrigatórios para o pipeline não falhar
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },

  // Formatos de relatório gerados na pasta coverage/
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

  testMatch: ['<rootDir>/test/**/*.test.js'],
  verbose: true,

  // Configuração do reporter JUnit para integração com GitHub Actions
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '.',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
};

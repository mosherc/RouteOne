module.exports = {
  parserOptions: {
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prefer-template': 'error',
    'import/prefer-default-export': 0,
    'func-names': 0,
    'no-plusplus': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}],
  ]
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    }
  }
};

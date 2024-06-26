
module.exports = {
  extends: 'erb',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
	'prettier/prettier' : 0,
	'import/no-cycle' : 0,
	'import/newline-after-import' : 0,
	'import/no-mutable-exports' : 0,
	'prefer-const' : 0,
	'no-else-return' : 0,
	'no-console' : 0,
	'@typescript-eslint/no-throw-literal' : 0,
	'@typescript-eslint/no-shadow' : 0,
	'@typescript-eslint/no-unused-vars' : 0,
	'no-empty' : 0, 
	'promise/no-callback-in-promise' : 0,
	'@typescript-eslint/no-explicit-any' : 0,
	'no-plusplus' : 0,
	'no-param-reassign' : 0,
	'global-require' : 0,
	'spaced-comment' : 0,
	'no-lonely-if' : 0,
	'prefer-template' : 0,
	'consistent-return' : 0,
	'promise/catch-or-return' : 0,
	'promise/always-return ' : 0,
	'promise/always-return' : 0,
	'@typescript-eslint/no-non-null-assertion' : 0,
	'import/order' : 0,
	'jsx-a11y/label-has-associated-control' : 0,
	'no-underscore-dangle' : 0,
	'@typescript-eslint/naming-convention' : 0,
	'react/button-has-type' : 0,
	'@typescript-eslint/no-use-before-define' : 0,
	'jsx-a11y/alt-text ' : 0,
	'max-classes-per-file' : 0,
	'react/jsx-props-no-spreading' : 0,
	'jsx-a11y/click-events-have-key-events' : 0,
	'jsx-a11y/alt-text' : 0,
	'react/destructuring-assignment' : 0,
	'jsx-a11y/no-static-element-interactions' : 0,
	'jsx-a11y/no-noninteractive-element-interactions' : 0,
	'react/sort-comp' : 0,
	'react/state-in-constructor' : 0,
	'react/require-default-props' : 0,
	'react/jsx-no-bind' : 0,
	'@typescript-eslint/lines-between-class-members' : 'warn',
	'react/self-closing-comp' : 'warn',
	'prefer-destructuring' : 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.ts'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};

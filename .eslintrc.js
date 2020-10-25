module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        'react-native/react-native': true,
    },
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-native', '@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
        'react-native/style-sheet-object-names': ['StyleSheet'],
    },
    rules: {
        'no-console': 'warn',
        'react-native/no-unused-styles': 'warn',
        'react-native/split-platform-components': 'warn',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-raw-text': 'warn',
        'semi': ['warn', 'never'],
    },
};

module.exports = {
    parserOptions: {
        project: 'server/tsconfig.json',
        sourceType: 'module'
    },
    env: {
        node: true,
        jest: true
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
    }
};

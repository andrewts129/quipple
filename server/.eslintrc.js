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
        '@typescript-eslint/explicit-function-return-type': 'off'
    }
};

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    tseslint.configs.stylistic,
    {
        plugins: {
            prettier: eslintPluginPrettierRecommended,
        },
        rules: {
            semi: ['error', 'never'],
            'prettier/prettier': ['error', prettierConfig],
        },
    },
)

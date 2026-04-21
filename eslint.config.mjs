import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

export default tsEslint.config(
  {
    ignores: ['node_modules/**', 'build/**'],
  },
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  // 这里关闭与 Prettier 冲突的格式规则，统一以 Prettier 作为代码样式的最终结果。
  eslintConfigPrettier,
);

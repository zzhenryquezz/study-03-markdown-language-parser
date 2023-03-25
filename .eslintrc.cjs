/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  overwrites: [
    {
      files: ['*.vue'],
      settings: {
        'import/resolver': {
          typescript: {
            project: './tsconfig.app.json'
          }
        }
      }
    }
  ]
}

import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
  },
  {
    files: ['**/*.ts'],
    rules: {
      // コンソールは出力で使うのでエラーにはしません
      'no-console': 'off',
    },
  },
)

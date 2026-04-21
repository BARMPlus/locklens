module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 这里显式锁定仓库允许的提交类型，保证提交格式与 standard-version 的 changelog 产出保持一致。
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'test', 'build', 'ci', 'perf', 'revert'],
    ],
  },
}

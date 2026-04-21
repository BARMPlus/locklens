const TYPE_TITLES = {
  feat: 'Features',
  fix: 'Bug Fixes',
  perf: 'Performance Improvements',
  revert: 'Reverts',
  docs: 'Documentation',
  style: 'Styles',
  refactor: 'Code Refactoring',
  test: 'Tests',
  build: 'Build System',
  ci: 'Continuous Integration',
  chore: 'Chores',
}

let commitSequence = 0

module.exports = {
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  types: Object.entries(TYPE_TITLES).map(([type, section]) => ({
    type,
    section,
    hidden: false,
  })),
  writerOpts: {
    transform: (commit) => {
      if (!commit.type || !commit.subject) {
        return undefined
      }

      const sectionTitle = TYPE_TITLES[commit.type]

      if (!sectionTitle) {
        return undefined
      }

      // 这里记录 commit 进入 changelog 处理管道时的顺序，后续分组排序会复用这个值，
      // 尽量让最终输出更接近 git log 的自然顺序，而不是按默认字母序重新洗牌。
      commitSequence += 1

      return {
        ...commit,
        shortHash: commit.hash ? commit.hash.substring(0, 7) : commit.shortHash,
        type: sectionTitle,
        __sequence: commitSequence,
      }
    },
    // 这里让每个分组按照该分组中最早进入管道的 commit 顺序排序，
    // 避免 Features / Fixes / Chores 被默认排序规则打乱。
    commitGroupsSort: (left, right) => {
      const leftOrder = left.commits?.[0]?.__sequence ?? Number.MAX_SAFE_INTEGER
      const rightOrder = right.commits?.[0]?.__sequence ?? Number.MAX_SAFE_INTEGER

      return leftOrder - rightOrder
    },
    // 这里保留同一分组内的 commit 原始进入顺序，避免 standard-version 默认再按字段排序。
    commitsSort: (left, right) => {
      const leftOrder = left.__sequence ?? Number.MAX_SAFE_INTEGER
      const rightOrder = right.__sequence ?? Number.MAX_SAFE_INTEGER

      return leftOrder - rightOrder
    },
  },
}

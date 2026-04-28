# \`micro-app\` 审计结果

## 审计概览

- 审计来源：https://github.com/BARMPlus/micro-app
- lockFile：yarn.lock

---

## 风险分布

- **严重漏洞**：共计 **6** 个
- **高危漏洞**：共计 **29** 个
- **中危漏洞**：共计 **29** 个
- **低危漏洞**：共计 **6** 个
- **风险漏洞总数**：**70**

---

## 漏洞详情

> 当前展示的漏洞最低级别为低危，下面将展示低危、中危、高危、严重的错误信息，这些错误总数一共为70个。


### 严重漏洞

共计 **6** 个

#### `@babel/traverse`

- **标题**：Babel vulnerable to arbitrary code execution when compiling specifically crafted malicious code
- **漏洞编号**：GHSA-67hx-6x53-jw92
- **漏洞等级**：严重
- **漏洞详情**：https://github.com/advisories/GHSA-67hx-6x53-jw92
- **依赖关系**：
  - `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `@babel/core` / `@babel/helper-module-transforms` / `@babel/traverse`
  - `@babel/core` / `@babel/traverse`
  - `@babel/preset-env` / `@babel/plugin-transform-modules-amd` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `@jest/core` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `@babel/helper-module-transforms` / `@babel/helper-replace-supers` / `@babel/traverse`

---

#### `json-schema`

- **标题**：json-schema is vulnerable to Prototype Pollution
- **漏洞编号**：GHSA-896r-f27r-55mw
- **漏洞等级**：严重
- **漏洞详情**：https://github.com/advisories/GHSA-896r-f27r-55mw
- **依赖关系**：
  - `coveralls` / `request` / `http-signature` / `jsprim` / `json-schema`

---

#### `form-data`

- **标题**：form-data uses unsafe random function in form-data for choosing boundary
- **漏洞编号**：GHSA-fjxv-7rqg-78g4
- **漏洞等级**：严重
- **漏洞详情**：https://github.com/advisories/GHSA-fjxv-7rqg-78g4
- **依赖关系**：
  - `coveralls` / `request` / `form-data`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`

---

#### `shell-quote`

- **标题**：Improper Neutralization of Special Elements used in a Command in Shell-quote
- **漏洞编号**：GHSA-g4rg-993r-mgx7
- **漏洞等级**：严重
- **漏洞详情**：https://github.com/advisories/GHSA-g4rg-993r-mgx7
- **依赖关系**：
  - `npm-run-all` / `shell-quote`

---

#### `dompurify`

- **标题**：DOMPurify vulnerable to tampering by prototype polution
- **漏洞编号**：GHSA-p3vf-v8qc-cwcr
- **漏洞等级**：严重
- **漏洞详情**：https://github.com/advisories/GHSA-p3vf-v8qc-cwcr
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `minimist`

- **标题**：Prototype Pollution in minimist
- **漏洞编号**：GHSA-xvch-5gv4-984h
- **漏洞等级**：严重
- **漏洞详情**：https://github.com/advisories/GHSA-xvch-5gv4-984h
- **依赖关系**：
  - `@babel/core` / `json5` / `minimist`
  - `babel-jest` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `coveralls` / `minimist`
  - `dts-bundle` / `detect-indent` / `minimist`
  - `eslint-plugin-import` / `tsconfig-paths` / `json5` / `minimist`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `jest` / `@jest/core` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `json5` / `minimist`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5` / `minimist`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `json5` / `minimist`

---

### 高危漏洞

共计 **29** 个

#### `minimatch`

- **标题**：minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
- **漏洞编号**：GHSA-23c5-xmqv-rm74
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-23c5-xmqv-rm74
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `minimatch`
  - `dts-bundle` / `glob` / `minimatch`
  - `eslint` / `minimatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`

---

#### `flatted`

- **标题**：flatted vulnerable to unbounded recursion DoS in parse() revive phase
- **漏洞编号**：GHSA-25h7-pfq9-p65f
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-25h7-pfq9-p65f
- **依赖关系**：
  - `eslint` / `file-entry-cache` / `flat-cache` / `flatted`

---

#### `prismjs`

- **标题**：Cross-site Scripting in Prism
- **漏洞编号**：GHSA-3949-f494-cm99
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-3949-f494-cm99
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `prismjs`
  - `docsify-cli` / `docsify` / `prismjs`

---

#### `ws`

- **标题**：ws affected by a DoS when handling a request with many HTTP headers
- **漏洞编号**：GHSA-3h5v-q93c-6h6q
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-3h5v-q93c-6h6q
- **依赖关系**：
  - `docsify-cli` / `livereload` / `ws`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`

---

#### `minimatch`

- **标题**：minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern
- **漏洞编号**：GHSA-3ppc-4f35-3m26
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-3ppc-4f35-3m26
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `minimatch`
  - `dts-bundle` / `glob` / `minimatch`
  - `eslint` / `minimatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`

---

#### `cross-spawn`

- **标题**：Regular Expression Denial of Service (ReDoS) in cross-spawn
- **漏洞编号**：GHSA-3xgq-45jj-v275
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-3xgq-45jj-v275
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `cross-env` / `cross-spawn`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `jest` / `@jest/core` / `jest-changed-files` / `execa` / `cross-spawn`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `jest` / `jest-cli` / `@jest/core` / `jest-changed-files` / `execa` / `cross-spawn`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn`
  - `lint-staged` / `execa` / `cross-spawn`
  - `npm-run-all` / `cross-spawn`

---

#### `semver-regex`

- **标题**：semver-regex Regular Expression Denial of Service (ReDOS)
- **漏洞编号**：GHSA-44c6-4v22-4mhx
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-44c6-4v22-4mhx
- **依赖关系**：
  - `husky` / `find-versions` / `semver-regex`

---

#### `terser`

- **标题**：Terser insecure use of regular expressions leads to ReDoS
- **漏洞编号**：GHSA-4wf5-vphf-c2xc
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-4wf5-vphf-c2xc
- **依赖关系**：
  - `rollup-plugin-terser` / `terser`

---

#### `serialize-javascript`

- **标题**：Serialize JavaScript is Vulnerable to RCE via RegExp.flags and Date.prototype.toISOString()
- **漏洞编号**：GHSA-5c6j-r48x-rmvq
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-5c6j-r48x-rmvq
- **依赖关系**：
  - `rollup-plugin-terser` / `serialize-javascript`

---

#### `marked`

- **标题**：Inefficient Regular Expression Complexity in marked
- **漏洞编号**：GHSA-5v2h-r2cx-5xgj
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-5v2h-r2cx-5xgj
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `marked`
  - `docsify-cli` / `docsify` / `marked`

---

#### `minimatch`

- **标题**：minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments
- **漏洞编号**：GHSA-7r86-cg39-jmmj
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-7r86-cg39-jmmj
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `minimatch`
  - `dts-bundle` / `glob` / `minimatch`
  - `eslint` / `minimatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`

---

#### `ansi-regex`

- **标题**：Inefficient Regular Expression Complexity in chalk/ansi-regex
- **漏洞编号**：GHSA-93q8-gq69-wqmw
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-93q8-gq69-wqmw
- **依赖关系**：
  - `@commitlint/cli` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `@commitlint/cli` / `yargs` / `string-width` / `strip-ansi` / `ansi-regex`
  - `@types/jest` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `@types/jest` / `pretty-format` / `ansi-regex`
  - `docsify-cli` / `update-notifier` / `boxen` / `ansi-align` / `string-width` / `strip-ansi` / `ansi-regex`
  - `docsify-cli` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `docsify-cli` / `yargs` / `cliui` / `wrap-ansi` / `string-width` / `strip-ansi` / `ansi-regex`
  - `docsify-cli` / `yargs` / `string-width` / `strip-ansi` / `ansi-regex`
  - `eslint` / `strip-ansi` / `ansi-regex`
  - `eslint` / `table` / `strip-ansi` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `@jest/globals` / `expect` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-message-util` / `pretty-format` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-runner` / `jest-runtime` / `@jest/globals` / `expect` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-runner` / `jest-runtime` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-runtime` / `@jest/globals` / `expect` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-runtime` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-snapshot` / `expect` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-snapshot` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `@jest/core` / `jest-snapshot` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `@jest/globals` / `expect` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `yargs` / `cliui` / `wrap-ansi` / `string-width` / `strip-ansi` / `ansi-regex`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `@jest/globals` / `expect` / `jest-matcher-utils` / `jest-diff` / `pretty-format` / `ansi-regex`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`
  - `jest` / `jest-cli` / `yargs` / `cliui` / `string-width` / `strip-ansi` / `ansi-regex`

---

#### `json5`

- **标题**：Prototype Pollution in JSON5 via Parse Method
- **漏洞编号**：GHSA-9c47-m6qq-7p4h
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-9c47-m6qq-7p4h
- **依赖关系**：
  - `@babel/core` / `json5`
  - `babel-jest` / `@jest/transform` / `@babel/core` / `json5`
  - `eslint-plugin-import` / `tsconfig-paths` / `json5`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `@babel/core` / `json5`
  - `jest` / `@jest/core` / `@jest/transform` / `@babel/core` / `json5`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `json5`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `json5`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `json5`

---

#### `picomatch`

- **标题**：Picomatch has a ReDoS vulnerability via extglob quantifiers
- **漏洞编号**：GHSA-c2c7-rcm5-vvqj
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
- **依赖关系**：
  - `@rollup/plugin-babel` / `@rollup/pluginutils` / `picomatch`
  - `@typescript-eslint/eslint-plugin` / `@typescript-eslint/experimental-utils` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch` / `picomatch`
  - `@typescript-eslint/parser` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch` / `picomatch`
  - `babel-jest` / `@jest/transform` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `ts-jest` / `jest-util` / `micromatch` / `picomatch`

---

#### `semver`

- **标题**：semver vulnerable to Regular Expression Denial of Service
- **漏洞编号**：GHSA-c2qf-rxjj-qqgw
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-c2qf-rxjj-qqgw
- **依赖关系**：
  - `@babel/core` / `semver`
  - `@babel/plugin-transform-runtime` / `semver`
  - `@babel/preset-env` / `@babel/helper-compilation-targets` / `semver`
  - `@babel/preset-env` / `@babel/plugin-proposal-object-rest-spread` / `@babel/helper-compilation-targets` / `semver`
  - `@babel/preset-env` / `core-js-compat` / `semver`
  - `@babel/preset-env` / `semver`
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/is-ignored` / `semver`
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `meow` / `normalize-package-data` / `semver`
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `meow` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `@commitlint/cli` / `@commitlint/read` / `git-raw-commits` / `meow` / `normalize-package-data` / `semver`
  - `@commitlint/cli` / `@commitlint/read` / `git-raw-commits` / `meow` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `@typescript-eslint/eslint-plugin` / `@typescript-eslint/experimental-utils` / `@typescript-eslint/typescript-estree` / `semver`
  - `@typescript-eslint/eslint-plugin` / `semver`
  - `@typescript-eslint/parser` / `@typescript-eslint/typescript-estree` / `semver`
  - `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `babel-jest` / `@jest/transform` / `@babel/core` / `semver`
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `babel-jest` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `babel-jest` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `semver`
  - `docsify-cli` / `cp-file` / `make-dir` / `semver`
  - `docsify-cli` / `update-notifier` / `configstore` / `make-dir` / `semver`
  - `docsify-cli` / `update-notifier` / `latest-version` / `package-json` / `semver`
  - `docsify-cli` / `update-notifier` / `semver-diff` / `semver`
  - `eslint-plugin-import` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `eslint-plugin-node` / `semver`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `jest` / `@jest/core` / `@jest/reporters` / `istanbul-lib-report` / `make-dir` / `semver`
  - `jest` / `@jest/core` / `@jest/reporters` / `node-notifier` / `semver`
  - `jest` / `@jest/core` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `@jest/core` / `@jest/transform` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-resolve` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `jest-snapshot` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `jest` / `@jest/core` / `jest-resolve` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `@jest/reporters` / `istanbul-lib-report` / `make-dir` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `@jest/reporters` / `istanbul-reports` / `istanbul-lib-report` / `make-dir` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-resolve` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-runtime` / `jest-snapshot` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `@jest/test-sequencer` / `jest-runner` / `jest-resolve` / `read-pkg-up` / `read-pkg` / `normalize-package-data` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `@babel/helper-compilation-targets` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `semver`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `execa` / `cross-spawn` / `semver`
  - `npm-run-all` / `cross-spawn` / `semver`
  - `npm-run-all` / `read-pkg` / `normalize-package-data` / `semver`

---

#### `minimatch`

- **标题**：minimatch ReDoS vulnerability
- **漏洞编号**：GHSA-f8q6-p94x-37v3
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-f8q6-p94x-37v3
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `minimatch`
  - `dts-bundle` / `glob` / `minimatch`
  - `eslint` / `minimatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch`

---

#### `rollup`

- **标题**：DOM Clobbering Gadget found in rollup bundled scripts that leads to XSS
- **漏洞编号**：GHSA-gcx4-mw62-g8wm
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-gcx4-mw62-g8wm
- **依赖关系**：
  - `rollup`

---

#### `braces`

- **标题**：Uncontrolled resource consumption in braces
- **漏洞编号**：GHSA-grv7-fg5c-xmjg
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-grv7-fg5c-xmjg
- **依赖关系**：
  - `@typescript-eslint/eslint-plugin` / `@typescript-eslint/experimental-utils` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch` / `braces`
  - `@typescript-eslint/parser` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch` / `braces`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch` / `braces`
  - `babel-jest` / `@jest/transform` / `jest-util` / `micromatch` / `braces`
  - `docsify-cli` / `livereload` / `chokidar` / `braces`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `braces`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `braces`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `braces`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `braces`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `braces`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces`
  - `lint-staged` / `micromatch` / `braces`
  - `live-server` / `chokidar` / `anymatch` / `micromatch` / `braces`
  - `live-server` / `chokidar` / `braces`
  - `ts-jest` / `jest-util` / `micromatch` / `braces`

---

#### `dompurify`

- **标题**：DOMpurify has a nesting-based mXSS
- **漏洞编号**：GHSA-gx9m-whjm-85jf
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-gx9m-whjm-85jf
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `qs`

- **标题**：qs vulnerable to Prototype Pollution
- **漏洞编号**：GHSA-hrpp-h998-j3pp
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-hrpp-h998-j3pp
- **依赖关系**：
  - `coveralls` / `request` / `qs`

---

#### `tmpl`

- **标题**：tmpl vulnerable to Inefficient Regular Expression Complexity which may lead to resource exhaustion
- **漏洞编号**：GHSA-jgrx-mgxx-jf9v
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-jgrx-mgxx-jf9v
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `walker` / `makeerror` / `tmpl`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `walker` / `makeerror` / `tmpl`

---

#### `dompurify`

- **标题**：DOMPurify allows tampering by prototype pollution
- **漏洞编号**：GHSA-mmhx-hmjr-r674
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-mmhx-hmjr-r674
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `rollup`

- **标题**：Rollup 4 has Arbitrary File Write via Path Traversal
- **漏洞编号**：GHSA-mw96-cpmx-2vgc
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-mw96-cpmx-2vgc
- **依赖关系**：
  - `rollup`

---

#### `lodash`

- **标题**：lodash vulnerable to Code Injection via `_.template` imports key names
- **漏洞编号**：GHSA-r5fr-rjxr-66jc
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-r5fr-rjxr-66jc
- **依赖关系**：
  - `@babel/core` / `lodash`
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `lodash`
  - `@commitlint/cli` / `@commitlint/load` / `@commitlint/resolve-extends` / `lodash`
  - `@commitlint/cli` / `@commitlint/load` / `lodash`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`

---

#### `node-fetch`

- **标题**：node-fetch forwards secure headers to untrusted sites
- **漏洞编号**：GHSA-r683-j2x4-v87g
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-r683-j2x4-v87g
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `node-fetch`
  - `node-fetch`

---

#### `http-cache-semantics`

- **标题**：http-cache-semantics vulnerable to Regular Expression Denial of Service
- **漏洞编号**：GHSA-rc47-6667-2j5j
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-rc47-6667-2j5j
- **依赖关系**：
  - `docsify-cli` / `update-notifier` / `latest-version` / `package-json` / `got` / `cacheable-request` / `http-cache-semantics`

---

#### `flatted`

- **标题**：Prototype Pollution via parse() in NodeJS flatted
- **漏洞编号**：GHSA-rf6f-7fwh-wjgh
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
- **依赖关系**：
  - `eslint` / `file-entry-cache` / `flat-cache` / `flatted`

---

#### `marked`

- **标题**：Inefficient Regular Expression Complexity in marked
- **漏洞编号**：GHSA-rrrm-qjm4-v8hf
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-rrrm-qjm4-v8hf
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `marked`
  - `docsify-cli` / `docsify` / `marked`

---

#### `decode-uri-component`

- **标题**：decode-uri-component vulnerable to Denial of Service (DoS)
- **漏洞编号**：GHSA-w573-4hg7-7wgq
- **漏洞等级**：高危
- **漏洞详情**：https://github.com/advisories/GHSA-w573-4hg7-7wgq
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch` / `extglob` / `expand-brackets` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `live-server` / `chokidar` / `anymatch` / `micromatch` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `live-server` / `chokidar` / `anymatch` / `micromatch` / `snapdragon` / `source-map-resolve` / `decode-uri-component`
  - `live-server` / `chokidar` / `braces` / `snapdragon` / `source-map-resolve` / `decode-uri-component`

---

### 中危漏洞

共计 **29** 个

#### `ajv`

- **标题**：ajv has ReDoS when using `$data` option
- **漏洞编号**：GHSA-2g4f-4pwh-qvx6
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
- **依赖关系**：
  - `coveralls` / `request` / `har-validator` / `ajv`
  - `eslint` / `@eslint/eslintrc` / `ajv`
  - `eslint` / `ajv`
  - `eslint` / `table` / `ajv`

---

#### `trim-off-newlines`

- **标题**：Uncontrolled Resource Consumption in trim-off-newlines
- **漏洞编号**：GHSA-38fc-wpqx-33j7
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-38fc-wpqx-33j7
- **依赖关系**：
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `trim-off-newlines`

---

#### `dompurify`

- **标题**：DOMPurify&#39;s ADD_TAGS function form bypasses FORBID_TAGS due to short-circuit evaluation
- **漏洞编号**：GHSA-39q2-94rc-95cp
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-39q2-94rc-95cp
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `picomatch`

- **标题**：Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching
- **漏洞编号**：GHSA-3v7f-55p6-f55p
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-3v7f-55p6-f55p
- **依赖关系**：
  - `@rollup/plugin-babel` / `@rollup/pluginutils` / `picomatch`
  - `@typescript-eslint/eslint-plugin` / `@typescript-eslint/experimental-utils` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch` / `picomatch`
  - `@typescript-eslint/parser` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch` / `picomatch`
  - `babel-jest` / `@jest/transform` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch` / `picomatch`
  - `ts-jest` / `jest-util` / `micromatch` / `picomatch`

---

#### `yaml`

- **标题**：yaml is vulnerable to Stack Overflow via deeply nested YAML collections
- **漏洞编号**：GHSA-48c2-rrv3-qjmp
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-48c2-rrv3-qjmp
- **依赖关系**：
  - `@commitlint/cli` / `@commitlint/load` / `cosmiconfig` / `yaml`
  - `husky` / `cosmiconfig` / `yaml`

---

#### `marked`

- **标题**：Regular Expression Denial of Service (REDoS) in Marked
- **漏洞编号**：GHSA-4r62-v4vq-hr96
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-4r62-v4vq-hr96
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `marked`
  - `docsify-cli` / `docsify` / `marked`

---

#### `docsify`

- **标题**：Docsify vulnerable to cross-site scripting due to mishandled encoding
- **漏洞编号**：GHSA-5h7x-68wj-jhwc
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-5h7x-68wj-jhwc
- **依赖关系**：
  - `docsify-cli` / `docsify`
  - `docsify-cli` / `docsify-server-renderer` / `docsify`

---

#### `qs`

- **标题**：qs&#39;s arrayLimit bypass in its bracket notation allows DoS via memory exhaustion
- **漏洞编号**：GHSA-6rw7-vpxm-498p
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-6rw7-vpxm-498p
- **依赖关系**：
  - `coveralls` / `request` / `qs`

---

#### `tough-cookie`

- **标题**：tough-cookie Prototype Pollution vulnerability
- **漏洞编号**：GHSA-72xf-g2v4-qvf3
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-72xf-g2v4-qvf3
- **依赖关系**：
  - `coveralls` / `request` / `tough-cookie`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`

---

#### `micromatch`

- **标题**：Regular Expression Denial of Service (ReDoS) in micromatch
- **漏洞编号**：GHSA-952p-6rrq-rcjv
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-952p-6rrq-rcjv
- **依赖关系**：
  - `@typescript-eslint/eslint-plugin` / `@typescript-eslint/experimental-utils` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch`
  - `@typescript-eslint/parser` / `@typescript-eslint/typescript-estree` / `globby` / `fast-glob` / `micromatch`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `babel-jest` / `@jest/transform` / `jest-util` / `micromatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `jest` / `@jest/core` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `jest-util` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `anymatch` / `micromatch`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `jest-haste-map` / `sane` / `micromatch`
  - `lint-staged` / `micromatch`
  - `live-server` / `chokidar` / `anymatch` / `micromatch`
  - `live-server` / `chokidar` / `readdirp` / `micromatch`
  - `ts-jest` / `jest-util` / `micromatch`

---

#### `@babel/helpers`

- **标题**：Babel has inefficient RegExp complexity in generated code with .replace when transpiling named capturing groups
- **漏洞编号**：GHSA-968p-4wvh-cqc8
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-968p-4wvh-cqc8
- **依赖关系**：
  - `@babel/core` / `@babel/helpers`
  - `@babel/preset-env` / `@babel/plugin-transform-regenerator` / `regenerator-transform` / `@babel/runtime`
  - `@babel/runtime`
  - `@commitlint/cli` / `@babel/runtime`
  - `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `@jest/core` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `@babel/helpers`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `@babel/core` / `@babel/helpers`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `istanbul-lib-instrument` / `@babel/core` / `@babel/helpers`

---

#### `dompurify`

- **标题**：DOMPurify USE_PROFILES prototype pollution allows event handlers
- **漏洞编号**：GHSA-cj63-jhhr-wcxv
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-cj63-jhhr-wcxv
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `dompurify`

- **标题**：DOMPurify ADD_ATTR predicate skips URI validation
- **漏洞编号**：GHSA-cjmm-f4jc-qw8r
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-cjmm-f4jc-qw8r
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `dompurify`

- **标题**：DOMPurify has a SAFE_FOR_TEMPLATES bypass in RETURN_DOM mode
- **漏洞编号**：GHSA-crv5-9vww-q3g8
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-crv5-9vww-q3g8
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `lodash`

- **标题**：lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`
- **漏洞编号**：GHSA-f23m-r3pf-42rh
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-f23m-r3pf-42rh
- **依赖关系**：
  - `@babel/core` / `lodash`
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `lodash`
  - `@commitlint/cli` / `@commitlint/load` / `@commitlint/resolve-extends` / `lodash`
  - `@commitlint/cli` / `@commitlint/load` / `lodash`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`

---

#### `brace-expansion`

- **标题**：brace-expansion: Zero-step sequence causes process hang and memory exhaustion
- **漏洞编号**：GHSA-f886-m6hf-6m8v
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-f886-m6hf-6m8v
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `minimatch` / `brace-expansion`
  - `dts-bundle` / `glob` / `minimatch` / `brace-expansion`
  - `eslint` / `minimatch` / `brace-expansion`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`

---

#### `dompurify`

- **标题**：DOMPurify: FORBID_TAGS bypassed by function-based ADD_TAGS predicate (asymmetry with FORBID_ATTR fix)
- **漏洞编号**：GHSA-h7mw-gpvr-xq4m
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-h7mw-gpvr-xq4m
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `dompurify`

- **标题**：DOMPurify is vulnerable to mutation-XSS via Re-Contextualization 
- **漏洞编号**：GHSA-h8r8-wccr-v5f2
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-h8r8-wccr-v5f2
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `prismjs`

- **标题**：prismjs Regular Expression Denial of Service vulnerability
- **漏洞编号**：GHSA-hqhp-5p83-hx96
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-hqhp-5p83-hx96
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `prismjs`
  - `docsify-cli` / `docsify` / `prismjs`

---

#### `word-wrap`

- **标题**：word-wrap vulnerable to Regular Expression Denial of Service
- **漏洞编号**：GHSA-j8xg-fqg3-53r7
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-j8xg-fqg3-53r7
- **依赖关系**：
  - `eslint` / `optionator` / `word-wrap`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`

---

#### `js-yaml`

- **标题**：js-yaml has prototype pollution in merge (&lt;&lt;)
- **漏洞编号**：GHSA-mh29-5h37-fv8m
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-mh29-5h37-fv8m
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `babel-jest` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `coveralls` / `js-yaml`
  - `eslint` / `@eslint/eslintrc` / `js-yaml`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `@istanbuljs/load-nyc-config` / `js-yaml`

---

#### `request`

- **标题**：Server-Side Request Forgery in Request
- **漏洞编号**：GHSA-p8p7-x288-28g6
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-p8p7-x288-28g6
- **依赖关系**：
  - `coveralls` / `request`

---

#### `got`

- **标题**：Got allows a redirect to a UNIX socket
- **漏洞编号**：GHSA-pfrx-2q88-qq97
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-pfrx-2q88-qq97
- **依赖关系**：
  - `docsify-cli` / `update-notifier` / `latest-version` / `package-json` / `got`

---

#### `serialize-javascript`

- **标题**：Serialize JavaScript has CPU Exhaustion Denial of Service via crafted array-like objects
- **漏洞编号**：GHSA-qj8w-gfj5-8c6v
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-qj8w-gfj5-8c6v
- **依赖关系**：
  - `rollup-plugin-terser` / `serialize-javascript`

---

#### `minimist`

- **标题**：Prototype Pollution in minimist
- **漏洞编号**：GHSA-vh95-rmgr-6w4m
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-vh95-rmgr-6w4m
- **依赖关系**：
  - `dts-bundle` / `detect-indent` / `minimist`

---

#### `dompurify`

- **标题**：DOMPurify allows Cross-site Scripting (XSS)
- **漏洞编号**：GHSA-vhxf-7vqr-mrjg
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-vhxf-7vqr-mrjg
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `uuid`

- **标题**：uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided
- **漏洞编号**：GHSA-w5hq-g745-h8pq
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-w5hq-g745-h8pq
- **依赖关系**：
  - `coveralls` / `request` / `uuid`
  - `jest` / `@jest/core` / `@jest/reporters` / `node-notifier` / `uuid`
  - `jest` / `jest-cli` / `@jest/core` / `@jest/reporters` / `node-notifier` / `uuid`

---

#### `prismjs`

- **标题**：PrismJS DOM Clobbering vulnerability
- **漏洞编号**：GHSA-x7hr-w5r2-h6wg
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-x7hr-w5r2-h6wg
- **依赖关系**：
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `prismjs`
  - `docsify-cli` / `docsify` / `prismjs`

---

#### `lodash`

- **标题**：Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions
- **漏洞编号**：GHSA-xxjr-mmjv-4gpg
- **漏洞等级**：中危
- **漏洞详情**：https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
- **依赖关系**：
  - `@babel/core` / `lodash`
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `lodash`
  - `@commitlint/cli` / `@commitlint/load` / `@commitlint/resolve-extends` / `lodash`
  - `@commitlint/cli` / `@commitlint/load` / `lodash`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `data-urls` / `whatwg-url` / `lodash`

---

### 低危漏洞

共计 **6** 个

#### `semver-regex`

- **标题**：Regular expression denial of service in semver-regex
- **漏洞编号**：GHSA-4x5v-gmq8-25ch
- **漏洞等级**：低危
- **漏洞详情**：https://github.com/advisories/GHSA-4x5v-gmq8-25ch
- **依赖关系**：
  - `husky` / `find-versions` / `semver-regex`

---

#### `on-headers`

- **标题**：on-headers is vulnerable to http response header manipulation
- **漏洞编号**：GHSA-76c9-3jph-rj3q
- **漏洞等级**：低危
- **漏洞详情**：https://github.com/advisories/GHSA-76c9-3jph-rj3q
- **依赖关系**：
  - `live-server` / `morgan` / `on-headers`

---

#### `serve-static`

- **标题**：serve-static vulnerable to template injection that can lead to XSS
- **漏洞编号**：GHSA-cm22-4g7w-348p
- **漏洞等级**：低危
- **漏洞详情**：https://github.com/advisories/GHSA-cm22-4g7w-348p
- **依赖关系**：
  - `docsify-cli` / `serve-static`

---

#### `send`

- **标题**：send vulnerable to template injection that can lead to XSS
- **漏洞编号**：GHSA-m6fv-jmcg-4jfg
- **漏洞等级**：低危
- **漏洞详情**：https://github.com/advisories/GHSA-m6fv-jmcg-4jfg
- **依赖关系**：
  - `docsify-cli` / `serve-static` / `send`
  - `live-server` / `send`

---

#### `brace-expansion`

- **标题**：brace-expansion Regular Expression Denial of Service vulnerability
- **漏洞编号**：GHSA-v6h2-p8h4-qcjw
- **漏洞等级**：低危
- **漏洞详情**：https://github.com/advisories/GHSA-v6h2-p8h4-qcjw
- **依赖关系**：
  - `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `babel-jest` / `babel-plugin-istanbul` / `test-exclude` / `minimatch` / `brace-expansion`
  - `dts-bundle` / `glob` / `minimatch` / `brace-expansion`
  - `eslint` / `minimatch` / `brace-expansion`
  - `jest` / `@jest/core` / `@jest/reporters` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `@jest/core` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `babel-jest` / `@jest/transform` / `babel-plugin-istanbul` / `test-exclude` / `glob` / `minimatch` / `brace-expansion`

---

#### `@tootallnate/once`

- **标题**：@tootallnate/once vulnerable to Incorrect Control Flow Scoping
- **漏洞编号**：GHSA-vpq2-c234-7xj6
- **漏洞等级**：低危
- **漏洞详情**：https://github.com/advisories/GHSA-vpq2-c234-7xj6
- **依赖关系**：
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`

---

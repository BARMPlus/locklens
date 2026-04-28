# \`micro-app\` Audit Report

## Audit Overview

- Audit Source: https://github.com/BARMPlus/micro-app
- lockFile: yarn.lock

---

## Risk Breakdown

- **Critical**: **6**
- **High**: **29**
- **Moderate**: **29**
- **Low**: **6**
- **Total Vulnerabilities**: **70**

---

## Vulnerability Details

> The minimum displayed vulnerability level is Low. The following report shows Low, Moderate, High, Critical issues, with **70** issues in total.


### Critical

Count: **6**

#### `@babel/traverse`

- **Title**: Babel vulnerable to arbitrary code execution when compiling specifically crafted malicious code
- **Advisory ID**: GHSA-67hx-6x53-jw92
- **Severity**: Critical
- **Reference**: https://github.com/advisories/GHSA-67hx-6x53-jw92
- **Dependency Paths**:
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

- **Title**: json-schema is vulnerable to Prototype Pollution
- **Advisory ID**: GHSA-896r-f27r-55mw
- **Severity**: Critical
- **Reference**: https://github.com/advisories/GHSA-896r-f27r-55mw
- **Dependency Paths**:
  - `coveralls` / `request` / `http-signature` / `jsprim` / `json-schema`

---

#### `form-data`

- **Title**: form-data uses unsafe random function in form-data for choosing boundary
- **Advisory ID**: GHSA-fjxv-7rqg-78g4
- **Severity**: Critical
- **Reference**: https://github.com/advisories/GHSA-fjxv-7rqg-78g4
- **Dependency Paths**:
  - `coveralls` / `request` / `form-data`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `form-data`

---

#### `shell-quote`

- **Title**: Improper Neutralization of Special Elements used in a Command in Shell-quote
- **Advisory ID**: GHSA-g4rg-993r-mgx7
- **Severity**: Critical
- **Reference**: https://github.com/advisories/GHSA-g4rg-993r-mgx7
- **Dependency Paths**:
  - `npm-run-all` / `shell-quote`

---

#### `dompurify`

- **Title**: DOMPurify vulnerable to tampering by prototype polution
- **Advisory ID**: GHSA-p3vf-v8qc-cwcr
- **Severity**: Critical
- **Reference**: https://github.com/advisories/GHSA-p3vf-v8qc-cwcr
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `minimist`

- **Title**: Prototype Pollution in minimist
- **Advisory ID**: GHSA-xvch-5gv4-984h
- **Severity**: Critical
- **Reference**: https://github.com/advisories/GHSA-xvch-5gv4-984h
- **Dependency Paths**:
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

### High

Count: **29**

#### `minimatch`

- **Title**: minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions
- **Advisory ID**: GHSA-23c5-xmqv-rm74
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-23c5-xmqv-rm74
- **Dependency Paths**:
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

- **Title**: flatted vulnerable to unbounded recursion DoS in parse() revive phase
- **Advisory ID**: GHSA-25h7-pfq9-p65f
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-25h7-pfq9-p65f
- **Dependency Paths**:
  - `eslint` / `file-entry-cache` / `flat-cache` / `flatted`

---

#### `prismjs`

- **Title**: Cross-site Scripting in Prism
- **Advisory ID**: GHSA-3949-f494-cm99
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-3949-f494-cm99
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `prismjs`
  - `docsify-cli` / `docsify` / `prismjs`

---

#### `ws`

- **Title**: ws affected by a DoS when handling a request with many HTTP headers
- **Advisory ID**: GHSA-3h5v-q93c-6h6q
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-3h5v-q93c-6h6q
- **Dependency Paths**:
  - `docsify-cli` / `livereload` / `ws`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `ws`

---

#### `minimatch`

- **Title**: minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern
- **Advisory ID**: GHSA-3ppc-4f35-3m26
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-3ppc-4f35-3m26
- **Dependency Paths**:
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

- **Title**: Regular Expression Denial of Service (ReDoS) in cross-spawn
- **Advisory ID**: GHSA-3xgq-45jj-v275
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-3xgq-45jj-v275
- **Dependency Paths**:
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

- **Title**: semver-regex Regular Expression Denial of Service (ReDOS)
- **Advisory ID**: GHSA-44c6-4v22-4mhx
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-44c6-4v22-4mhx
- **Dependency Paths**:
  - `husky` / `find-versions` / `semver-regex`

---

#### `terser`

- **Title**: Terser insecure use of regular expressions leads to ReDoS
- **Advisory ID**: GHSA-4wf5-vphf-c2xc
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-4wf5-vphf-c2xc
- **Dependency Paths**:
  - `rollup-plugin-terser` / `terser`

---

#### `serialize-javascript`

- **Title**: Serialize JavaScript is Vulnerable to RCE via RegExp.flags and Date.prototype.toISOString()
- **Advisory ID**: GHSA-5c6j-r48x-rmvq
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-5c6j-r48x-rmvq
- **Dependency Paths**:
  - `rollup-plugin-terser` / `serialize-javascript`

---

#### `marked`

- **Title**: Inefficient Regular Expression Complexity in marked
- **Advisory ID**: GHSA-5v2h-r2cx-5xgj
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-5v2h-r2cx-5xgj
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `marked`
  - `docsify-cli` / `docsify` / `marked`

---

#### `minimatch`

- **Title**: minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments
- **Advisory ID**: GHSA-7r86-cg39-jmmj
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-7r86-cg39-jmmj
- **Dependency Paths**:
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

- **Title**: Inefficient Regular Expression Complexity in chalk/ansi-regex
- **Advisory ID**: GHSA-93q8-gq69-wqmw
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-93q8-gq69-wqmw
- **Dependency Paths**:
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

- **Title**: Prototype Pollution in JSON5 via Parse Method
- **Advisory ID**: GHSA-9c47-m6qq-7p4h
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-9c47-m6qq-7p4h
- **Dependency Paths**:
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

- **Title**: Picomatch has a ReDoS vulnerability via extglob quantifiers
- **Advisory ID**: GHSA-c2c7-rcm5-vvqj
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
- **Dependency Paths**:
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

- **Title**: semver vulnerable to Regular Expression Denial of Service
- **Advisory ID**: GHSA-c2qf-rxjj-qqgw
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-c2qf-rxjj-qqgw
- **Dependency Paths**:
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

- **Title**: minimatch ReDoS vulnerability
- **Advisory ID**: GHSA-f8q6-p94x-37v3
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-f8q6-p94x-37v3
- **Dependency Paths**:
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

- **Title**: DOM Clobbering Gadget found in rollup bundled scripts that leads to XSS
- **Advisory ID**: GHSA-gcx4-mw62-g8wm
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-gcx4-mw62-g8wm
- **Dependency Paths**:
  - `rollup`

---

#### `braces`

- **Title**: Uncontrolled resource consumption in braces
- **Advisory ID**: GHSA-grv7-fg5c-xmjg
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-grv7-fg5c-xmjg
- **Dependency Paths**:
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

- **Title**: DOMpurify has a nesting-based mXSS
- **Advisory ID**: GHSA-gx9m-whjm-85jf
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-gx9m-whjm-85jf
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `qs`

- **Title**: qs vulnerable to Prototype Pollution
- **Advisory ID**: GHSA-hrpp-h998-j3pp
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-hrpp-h998-j3pp
- **Dependency Paths**:
  - `coveralls` / `request` / `qs`

---

#### `tmpl`

- **Title**: tmpl vulnerable to Inefficient Regular Expression Complexity which may lead to resource exhaustion
- **Advisory ID**: GHSA-jgrx-mgxx-jf9v
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-jgrx-mgxx-jf9v
- **Dependency Paths**:
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

- **Title**: DOMPurify allows tampering by prototype pollution
- **Advisory ID**: GHSA-mmhx-hmjr-r674
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-mmhx-hmjr-r674
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `rollup`

- **Title**: Rollup 4 has Arbitrary File Write via Path Traversal
- **Advisory ID**: GHSA-mw96-cpmx-2vgc
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-mw96-cpmx-2vgc
- **Dependency Paths**:
  - `rollup`

---

#### `lodash`

- **Title**: lodash vulnerable to Code Injection via `_.template` imports key names
- **Advisory ID**: GHSA-r5fr-rjxr-66jc
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-r5fr-rjxr-66jc
- **Dependency Paths**:
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

- **Title**: node-fetch forwards secure headers to untrusted sites
- **Advisory ID**: GHSA-r683-j2x4-v87g
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-r683-j2x4-v87g
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `node-fetch`
  - `node-fetch`

---

#### `http-cache-semantics`

- **Title**: http-cache-semantics vulnerable to Regular Expression Denial of Service
- **Advisory ID**: GHSA-rc47-6667-2j5j
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-rc47-6667-2j5j
- **Dependency Paths**:
  - `docsify-cli` / `update-notifier` / `latest-version` / `package-json` / `got` / `cacheable-request` / `http-cache-semantics`

---

#### `flatted`

- **Title**: Prototype Pollution via parse() in NodeJS flatted
- **Advisory ID**: GHSA-rf6f-7fwh-wjgh
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
- **Dependency Paths**:
  - `eslint` / `file-entry-cache` / `flat-cache` / `flatted`

---

#### `marked`

- **Title**: Inefficient Regular Expression Complexity in marked
- **Advisory ID**: GHSA-rrrm-qjm4-v8hf
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-rrrm-qjm4-v8hf
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `marked`
  - `docsify-cli` / `docsify` / `marked`

---

#### `decode-uri-component`

- **Title**: decode-uri-component vulnerable to Denial of Service (DoS)
- **Advisory ID**: GHSA-w573-4hg7-7wgq
- **Severity**: High
- **Reference**: https://github.com/advisories/GHSA-w573-4hg7-7wgq
- **Dependency Paths**:
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

### Moderate

Count: **29**

#### `ajv`

- **Title**: ajv has ReDoS when using `$data` option
- **Advisory ID**: GHSA-2g4f-4pwh-qvx6
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
- **Dependency Paths**:
  - `coveralls` / `request` / `har-validator` / `ajv`
  - `eslint` / `@eslint/eslintrc` / `ajv`
  - `eslint` / `ajv`
  - `eslint` / `table` / `ajv`

---

#### `trim-off-newlines`

- **Title**: Uncontrolled Resource Consumption in trim-off-newlines
- **Advisory ID**: GHSA-38fc-wpqx-33j7
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-38fc-wpqx-33j7
- **Dependency Paths**:
  - `@commitlint/cli` / `@commitlint/lint` / `@commitlint/parse` / `conventional-commits-parser` / `trim-off-newlines`

---

#### `dompurify`

- **Title**: DOMPurify&#39;s ADD_TAGS function form bypasses FORBID_TAGS due to short-circuit evaluation
- **Advisory ID**: GHSA-39q2-94rc-95cp
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-39q2-94rc-95cp
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `picomatch`

- **Title**: Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching
- **Advisory ID**: GHSA-3v7f-55p6-f55p
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-3v7f-55p6-f55p
- **Dependency Paths**:
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

- **Title**: yaml is vulnerable to Stack Overflow via deeply nested YAML collections
- **Advisory ID**: GHSA-48c2-rrv3-qjmp
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-48c2-rrv3-qjmp
- **Dependency Paths**:
  - `@commitlint/cli` / `@commitlint/load` / `cosmiconfig` / `yaml`
  - `husky` / `cosmiconfig` / `yaml`

---

#### `marked`

- **Title**: Regular Expression Denial of Service (REDoS) in Marked
- **Advisory ID**: GHSA-4r62-v4vq-hr96
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-4r62-v4vq-hr96
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `marked`
  - `docsify-cli` / `docsify` / `marked`

---

#### `docsify`

- **Title**: Docsify vulnerable to cross-site scripting due to mishandled encoding
- **Advisory ID**: GHSA-5h7x-68wj-jhwc
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-5h7x-68wj-jhwc
- **Dependency Paths**:
  - `docsify-cli` / `docsify`
  - `docsify-cli` / `docsify-server-renderer` / `docsify`

---

#### `qs`

- **Title**: qs&#39;s arrayLimit bypass in its bracket notation allows DoS via memory exhaustion
- **Advisory ID**: GHSA-6rw7-vpxm-498p
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-6rw7-vpxm-498p
- **Dependency Paths**:
  - `coveralls` / `request` / `qs`

---

#### `tough-cookie`

- **Title**: tough-cookie Prototype Pollution vulnerability
- **Advisory ID**: GHSA-72xf-g2v4-qvf3
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-72xf-g2v4-qvf3
- **Dependency Paths**:
  - `coveralls` / `request` / `tough-cookie`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `tough-cookie`

---

#### `micromatch`

- **Title**: Regular Expression Denial of Service (ReDoS) in micromatch
- **Advisory ID**: GHSA-952p-6rrq-rcjv
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-952p-6rrq-rcjv
- **Dependency Paths**:
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

- **Title**: Babel has inefficient RegExp complexity in generated code with .replace when transpiling named capturing groups
- **Advisory ID**: GHSA-968p-4wvh-cqc8
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-968p-4wvh-cqc8
- **Dependency Paths**:
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

- **Title**: DOMPurify USE_PROFILES prototype pollution allows event handlers
- **Advisory ID**: GHSA-cj63-jhhr-wcxv
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-cj63-jhhr-wcxv
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `dompurify`

- **Title**: DOMPurify ADD_ATTR predicate skips URI validation
- **Advisory ID**: GHSA-cjmm-f4jc-qw8r
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-cjmm-f4jc-qw8r
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `dompurify`

- **Title**: DOMPurify has a SAFE_FOR_TEMPLATES bypass in RETURN_DOM mode
- **Advisory ID**: GHSA-crv5-9vww-q3g8
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-crv5-9vww-q3g8
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `lodash`

- **Title**: lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`
- **Advisory ID**: GHSA-f23m-r3pf-42rh
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-f23m-r3pf-42rh
- **Dependency Paths**:
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

- **Title**: brace-expansion: Zero-step sequence causes process hang and memory exhaustion
- **Advisory ID**: GHSA-f886-m6hf-6m8v
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-f886-m6hf-6m8v
- **Dependency Paths**:
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

- **Title**: DOMPurify: FORBID_TAGS bypassed by function-based ADD_TAGS predicate (asymmetry with FORBID_ATTR fix)
- **Advisory ID**: GHSA-h7mw-gpvr-xq4m
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-h7mw-gpvr-xq4m
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `dompurify`

- **Title**: DOMPurify is vulnerable to mutation-XSS via Re-Contextualization 
- **Advisory ID**: GHSA-h8r8-wccr-v5f2
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-h8r8-wccr-v5f2
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `prismjs`

- **Title**: prismjs Regular Expression Denial of Service vulnerability
- **Advisory ID**: GHSA-hqhp-5p83-hx96
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-hqhp-5p83-hx96
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `prismjs`
  - `docsify-cli` / `docsify` / `prismjs`

---

#### `word-wrap`

- **Title**: word-wrap vulnerable to Regular Expression Denial of Service
- **Advisory ID**: GHSA-j8xg-fqg3-53r7
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-j8xg-fqg3-53r7
- **Dependency Paths**:
  - `eslint` / `optionator` / `word-wrap`
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `escodegen` / `optionator` / `word-wrap`

---

#### `js-yaml`

- **Title**: js-yaml has prototype pollution in merge (&lt;&lt;)
- **Advisory ID**: GHSA-mh29-5h37-fv8m
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-mh29-5h37-fv8m
- **Dependency Paths**:
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

- **Title**: Server-Side Request Forgery in Request
- **Advisory ID**: GHSA-p8p7-x288-28g6
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-p8p7-x288-28g6
- **Dependency Paths**:
  - `coveralls` / `request`

---

#### `got`

- **Title**: Got allows a redirect to a UNIX socket
- **Advisory ID**: GHSA-pfrx-2q88-qq97
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-pfrx-2q88-qq97
- **Dependency Paths**:
  - `docsify-cli` / `update-notifier` / `latest-version` / `package-json` / `got`

---

#### `serialize-javascript`

- **Title**: Serialize JavaScript has CPU Exhaustion Denial of Service via crafted array-like objects
- **Advisory ID**: GHSA-qj8w-gfj5-8c6v
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-qj8w-gfj5-8c6v
- **Dependency Paths**:
  - `rollup-plugin-terser` / `serialize-javascript`

---

#### `minimist`

- **Title**: Prototype Pollution in minimist
- **Advisory ID**: GHSA-vh95-rmgr-6w4m
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-vh95-rmgr-6w4m
- **Dependency Paths**:
  - `dts-bundle` / `detect-indent` / `minimist`

---

#### `dompurify`

- **Title**: DOMPurify allows Cross-site Scripting (XSS)
- **Advisory ID**: GHSA-vhxf-7vqr-mrjg
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-vhxf-7vqr-mrjg
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `dompurify`
  - `docsify-cli` / `docsify` / `dompurify`

---

#### `uuid`

- **Title**: uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided
- **Advisory ID**: GHSA-w5hq-g745-h8pq
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-w5hq-g745-h8pq
- **Dependency Paths**:
  - `coveralls` / `request` / `uuid`
  - `jest` / `@jest/core` / `@jest/reporters` / `node-notifier` / `uuid`
  - `jest` / `jest-cli` / `@jest/core` / `@jest/reporters` / `node-notifier` / `uuid`

---

#### `prismjs`

- **Title**: PrismJS DOM Clobbering vulnerability
- **Advisory ID**: GHSA-x7hr-w5r2-h6wg
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-x7hr-w5r2-h6wg
- **Dependency Paths**:
  - `docsify-cli` / `docsify-server-renderer` / `docsify` / `prismjs`
  - `docsify-cli` / `docsify` / `prismjs`

---

#### `lodash`

- **Title**: Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions
- **Advisory ID**: GHSA-xxjr-mmjv-4gpg
- **Severity**: Moderate
- **Reference**: https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
- **Dependency Paths**:
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

### Low

Count: **6**

#### `semver-regex`

- **Title**: Regular expression denial of service in semver-regex
- **Advisory ID**: GHSA-4x5v-gmq8-25ch
- **Severity**: Low
- **Reference**: https://github.com/advisories/GHSA-4x5v-gmq8-25ch
- **Dependency Paths**:
  - `husky` / `find-versions` / `semver-regex`

---

#### `on-headers`

- **Title**: on-headers is vulnerable to http response header manipulation
- **Advisory ID**: GHSA-76c9-3jph-rj3q
- **Severity**: Low
- **Reference**: https://github.com/advisories/GHSA-76c9-3jph-rj3q
- **Dependency Paths**:
  - `live-server` / `morgan` / `on-headers`

---

#### `serve-static`

- **Title**: serve-static vulnerable to template injection that can lead to XSS
- **Advisory ID**: GHSA-cm22-4g7w-348p
- **Severity**: Low
- **Reference**: https://github.com/advisories/GHSA-cm22-4g7w-348p
- **Dependency Paths**:
  - `docsify-cli` / `serve-static`

---

#### `send`

- **Title**: send vulnerable to template injection that can lead to XSS
- **Advisory ID**: GHSA-m6fv-jmcg-4jfg
- **Severity**: Low
- **Reference**: https://github.com/advisories/GHSA-m6fv-jmcg-4jfg
- **Dependency Paths**:
  - `docsify-cli` / `serve-static` / `send`
  - `live-server` / `send`

---

#### `brace-expansion`

- **Title**: brace-expansion Regular Expression Denial of Service vulnerability
- **Advisory ID**: GHSA-v6h2-p8h4-qcjw
- **Severity**: Low
- **Reference**: https://github.com/advisories/GHSA-v6h2-p8h4-qcjw
- **Dependency Paths**:
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

- **Title**: @tootallnate/once vulnerable to Incorrect Control Flow Scoping
- **Advisory ID**: GHSA-vpq2-c234-7xj6
- **Severity**: Low
- **Reference**: https://github.com/advisories/GHSA-vpq2-c234-7xj6
- **Dependency Paths**:
  - `jest` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`
  - `jest` / `jest-cli` / `@jest/core` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`
  - `jest` / `jest-cli` / `@jest/core` / `jest-runner` / `jest-runtime` / `jest-config` / `jest-environment-jsdom` / `jsdom` / `http-proxy-agent` / `@tootallnate/once`

---

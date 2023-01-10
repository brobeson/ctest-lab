---
title: Change Log
layout: default
nav_order: 5
---

<!-- markdownlint-disable no-duplicate-heading -->

# Change Log  <!-- markdownlint-disable-line single-h1 -->

## [0.4.0] — 2022-11-24

Added
: [#12](https://github.com/brobeson/ctest-lab/issues/12) — During test discovery,
  exclude tests that are not built

Added
: [#23](https://github.com/brobeson/ctest-lab/issues/23) — Run the
  [ms-vscode.cmake-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)
  build command before running tests. Users can disable this with
  [`"ctest-lab.buildBeforeRun": false`](settings#ctest-labbuildbeforerun) in
  their VS Code settings.

Fixed
: [#28](https://github.com/brobeson/ctest-lab/issues/28) — Removed obsolete
  information from the README file and user manual

Fixed
: [#25](https://github.com/brobeson/ctest-lab/issues/25) — Activate the output
  channel before running the tests

## [0.3.1] — 2022-11-06

Fixed
: [#24](https://github.com/brobeson/ctest-lab/issues/24) — The extension now
  activates properly

## [0.3.0] — 2022-10-08

Added
: [#15](https://github.com/brobeson/ctest-lab/issues/15) — Run tests via the
  `ctest` command:

Added
: [#17](https://github.com/brobeson/ctest-lab/issues/15) — Parse test results from
  `ctest` command output:

Added
: [#21](https://github.com/brobeson/ctest-lab/issues/21) — Run individual tests
  from the test view:

Removed
: [#18](https://github.com/brobeson/ctest-lab/issues/18) — `CTest: Discover Tests`
  command. Use VS Code's `Test: Refresh Tests` command, instead.

Removed
: Notice of which build directory CTest Lab will use when the extension
  activates.

## [0.2.0] — 2022-09-06

Added
: [#13](https://github.com/brobeson/ctest-lab/issues/13) — Ability to run
  discovered tests:

## [0.1.0] — 2022-09-02

Added
: [#2](https://github.com/brobeson/ctest-lab/issues/2) — Basic test discovery

[0.4.0]: https://github.com/brobeson/ctest-lab/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/brobeson/ctest-lab/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/brobeson/ctest-lab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/brobeson/ctest-lab/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/brobeson/ctest-lab/compare/2e0e350936d6e22192fe289864c565795f6b7924...v0.1.0

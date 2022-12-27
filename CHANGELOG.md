<!-- markdownlint-disable MD024 -->

# Change Log

This file documents all notable changes to the CTest Lab extension.

## [0.5.0] — Unreleased

### Added

- [#32](https://github.com/brobeson/ctest-lab/issues/32) The test view shows
  "(not run)" next to tests which CTest reports as not run.

## [0.4.0] — 2022-11-24

### Added

- [#12](https://github.com/brobeson/ctest-lab/issues/12) During test discovery,
  exclude tests that are not built
- [#23](https://github.com/brobeson/ctest-lab/issues/23) Run the
  [ms-vscode.cmake-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)
  build command before running tests.
  - Users can disable this with `"ctest-lab.buildBeforeRun": false` in their VS
    Code settings.

### Fixed

- [#28](https://github.com/brobeson/ctest-lab/issues/28) Removed obsolete
  information from the README file and user manual
- [#25](https://github.com/brobeson/ctest-lab/issues/25) Activate the output
  channel before running the tests

## [0.3.1] — 2022-11-06

### Fixed

- [#24](https://github.com/brobeson/ctest-lab/issues/24) The extension now
  activates properly

## [0.3.0] — 2022-10-08

### Added

- [#15](https://github.com/brobeson/ctest-lab/issues/15) Run tests via the
  `ctest` command:
- [#17](https://github.com/brobeson/ctest-lab/issues/15) Parse test results from
  `ctest` command output:
- [#21](https://github.com/brobeson/ctest-lab/issues/21) Run individual tests
  from the test view:

### Removed

- [#18](https://github.com/brobeson/ctest-lab/issues/18) `CTest: Discover Tests`
  command:
  - Use VS Code's `Test: Refresh Tests` command, instead.
- Notice of which build directory CTest Lab will use when the extension
  activates.

## [0.2.0] — 2022-09-06

### Added

- [#13](https://github.com/brobeson/ctest-lab/issues/13) Ability to run
  discovered tests:

## [0.1.0] — 2022-09-02

### Added

- [#2](https://github.com/brobeson/ctest-lab/issues/2) Basic test discovery

[0.5.0]: https://github.com/brobeson/ctest-lab/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/brobeson/ctest-lab/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/brobeson/ctest-lab/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/brobeson/ctest-lab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/brobeson/ctest-lab/compare/v0.1.0...v0.2.0
[0.1.0]:
  https://github.com/brobeson/ctest-lab/compare/2e0e350936d6e22192fe289864c565795f6b7924...v0.1.0

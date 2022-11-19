<!-- markdownlint-disable MD024 -->

# Change Log

This file documents all notable changes to the CTest Lab extension.

## Next Release

### Fixed

- Activate the output channel before running the tests
  [#25](https://github.com/brobeson/ctest-lab/issues/25)

## [0.3.1] — 2022-11-06

### Fixed

- The extension now activates properly
  [#24](https://github.com/brobeson/ctest-lab/issues/24)

## [0.3.0] — 2022-10-08

### Added

- Run tests via the `ctest` command:
  [#15](https://github.com/brobeson/ctest-lab/issues/15)
- Parse test results from `ctest` command output:
  [#17](https://github.com/brobeson/ctest-lab/issues/15)
- Run individual tests from the test view:
  [#21](https://github.com/brobeson/ctest-lab/issues/21)

### Removed

- `CTest: Discover Tests` command:
  [#18](https://github.com/brobeson/ctest-lab/issues/18)
  - Use VS Code's `Test: Refresh Tests` command, instead.
- Notice of which build directory CTest Lab will use when the extension
  activates.

## [0.2.0] — 2022-09-06

### Added

- Ability to run discovered tests:
  [#13](https://github.com/brobeson/ctest-lab/issues/13)

## [0.1.0] — 2022-09-02

### Added

- Basic test discovery: [#2](https://github.com/brobeson/ctest-lab/issues/2)

[unreleased]: https://github.com/brobeson/ctest-lab/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/brobeson/ctest-lab/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/brobeson/ctest-lab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/brobeson/ctest-lab/compare/v0.1.0...v0.2.0
[0.1.0]:
  https://github.com/brobeson/ctest-lab/compare/2e0e350936d6e22192fe289864c565795f6b7924...v0.1.0

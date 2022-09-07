# CTest Lab

[![Build and Test](https://github.com/brobeson/ctest-lab/actions/workflows/main.yaml/badge.svg)](https://github.com/brobeson/ctest-lab/actions/workflows/main.yaml)

Use VS Code's testing UI to discover, filter, and run tests registered with
CTest.

## Features

- Discover tests registered with CTest.
- Filter tests by CTest `LABELS` property.
- Run individual tests.

## Known Issues

[![GitHub issues by-label](https://img.shields.io/github/issues/brobeson/ctest-lab/bug?label=Bugs)](https://github.com/brobeson/ctest-lab/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
[![GitHub issues by-label](https://img.shields.io/github/issues/brobeson/ctest-lab/enhancement?label=Feature%20Requests)](https://github.com/brobeson/ctest-lab/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

- CTest Lab can only expand the VS Code variable `${workspaceFolder}` in the
  build directory setting. If you know how to expand arbitrary VS Code
  variables, please comment on
  [#7](https://github.com/brobeson/ctest-lab/issues/7); I haven't found any
  documentation for this, yet.
- CTest Lab includes tests that are not built in the discovery results. See
  [#12](https://github.com/brobeson/ctest-lab/issues/12) for details.
- CTest Lab does not run `ctest`; it runs the actual test commands. This means
  that CTest Lab does not support CTest features, yet. For example, features are
  not run, test properties such as `ENVIRONMENT` and `REQUIRED_FILES` are not
  respected. Watch [#15](https://github.com/brobeson/ctest-lab/issues/15) to see
  when I correct this.

## User Manual

Read the user manual at <https://brobeson.github.io/ctest-lab>.

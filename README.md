# CTest Lab

[![Build and Test](https://github.com/brobeson/ctest-lab/actions/workflows/main.yaml/badge.svg)](https://github.com/brobeson/ctest-lab/actions/workflows/main.yaml)

Use VS Code's testing UI to discover, filter, and run tests registered with
CTest.

## Features

- Discover tests registered with CTest.
- Filter tests by CTest `LABELS` property.

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

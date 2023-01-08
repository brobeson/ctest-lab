---
title: Settings
layout: default
---

<!-- Jekyll and Github Pages process this file into a website. Markdown lint -->
<!-- incorrectly claims the document has multiple top-level headings. I      -->
<!-- assume it confuses the Jekyll configuration above for a heading.        -->
<!-- markdownlint-disable MD025 -->
# Settings

CTest Lab provides its own settings and uses settings from the [cmake-tools
extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)
if they are available. When there is an equivalent setting, CTest Lab always
prefers the CMake Tools setting. This gives users one location to configure
testing options and helps users transition to CTest Lab.

## CMake-Tools Settings

### `cmake.buildDirectory`

- **Type:** string
- **Default Value:** not applicable
- **Description:** This is where CMake will configure your build system, build
  your software, and run your tests. CTest Lab uses this if it is set, otherwise
  it falls back to [`ctest-lab.buildDirectory`](#ctestlabbuilddirectory).

### `cmake.parallelJobs`

- **Type:** number
- **Default Value:** 0
- **Description:** Tell CTest Lab how many parallel jobs to use when it runs the
  tests. If this is 0, CTest Lab uses the number of cores available on the
  system. CTest Lab tries to use
  [`cmake.ctest.parallelJobs`](#cmakectestparalleljobs) first. If that is not
  set, or is set to 0, CTest Lab tries to use `cmake.parallelJobs`.

### `cmake.ctest.parallelJobs`

- **Type:** number
- **Default Value:** 0
- **Description:** Tell CTest Lab how many parallel jobs to use when it runs the
  tests. If this is not set, or is set to 0, CTest Lab tries to use
  [`cmake.parallelJobs`](#cmakeparalleljobs).

## CTest Lab Settings

### `ctest-lab.buildBeforeRun`

- **Type:** boolean
- **Default Value:** `true`
- **Description:** If you set this to `true`, CTest Lab will run a build before
  running tests. It runs the build by invoking the
  [cmake-tools extension's](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools)
  build command. If you do not have the [cmake-tools
  extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools),
  CTest Lab does not run a build, regardless of this
  setting's value.

### `ctest-lab.buildDirectory`

- **Type:** string
- **Default Value:** not applicable
- **Description:** This is where CTest Lab will run your tests. CTest Lab uses
  this only if [`cmake.buildDirectory`](#cmakebuilddirectory) is not set.

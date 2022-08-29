# CTest Lab

1. [Why CTest Lab](#why-ctest-lab)
1. [Getting Started](#getting-started)

## Why CTest Lab

There are other VS Code extensions tailored to specific test frameworks, such as
Catch2 or gtest. CTest is not restricted to compiled executables using those
frameworks. For example, you could have a test that runs a script to verify
installation of your package. You could have a CTest fixture that downloads
binary test data from the web. These types of tests and test relationships are
not captured by other extensions.

## Getting Started

Install the extension through the [VS Code marketplace](). I recommend
installing [ms-vscode.cmake-tools](), though it's not required. CTest Lab uses
settings from cmake-tools if they're available. This allows users to configure
CMake and CTest in one place. If you do not have cmake-tools, then CTest Lab
falls back to its own settings. VS Code activates CTest Lab if it detects a
_CMakeLists.txt_ file in your workspace. When activated, CTest Lab adds the
_Testing_ view to the main toolbar. Open this view to interact with your tests.

## Discovering Tests

Before you can run tests, you must tell CTest Lab to look for the tests. There
are three ways to discover tests:

1. CTest Lab attempts to discover tests when it activates.
1. You can run the `CTest: Discover Tests` command from the command palette.
1. You can click the `Refresh` button in the _Testing_ view.

Test discovery requires that you have configured your project. CTest Lab runs
the [ctest command]() to get the list of available tests. This also means that
CTest Lab may not be able to discover some tests until you build them. For
example, if you use [Catch2's add_test]() command, the tests are not actually
added until you build them. If the list of tests does not look correct, try
configuring and building your project, first.

## The Testing View

CTest Lab provides ways for you to interact with your tests in the _Testing_
View.

### Test Tags

VS Code's test API provides support for test tags. Users can filter tests by tag
in the _Testing_ view. CTest Lab checks your tests [`LABELS` properties]() and
adds all your labels as tags.

```cmake
add_test
```

<!-- Jekyll and Github Pages process this file into a website. A level -->
<!-- heading is redundant in the produced HTML. -->
<!-- markdownlint-disable MD041 -->

<!-- prettier-ignore -->
> ❗ **WARNING**
>
> This extension is still a preview lacking some major functionality.

## Why CTest Lab

There are other VS Code extensions tailored to specific test frameworks, such as
Catch2 or gtest. CTest is not restricted to compiled executables using those
frameworks. For example, you could have a test that runs a script to verify
installation of your package. You could have a CTest fixture that downloads
binary test data from the web. These types of tests and test relationships are
not captured by other extensions.

## Getting Started

Install the extension through the
[VS Code marketplace](https://marketplace.visualstudio.com/items?itemName=brobeson.ctest-lab).
I recommend installing
[ms-vscode.cmake-tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cmake-tools),
though it's not required. CTest Lab uses settings from cmake-tools if they're
available. This allows users to configure CMake and CTest in one place. If you
do not have cmake-tools, then CTest Lab falls back to its own settings. VS Code
activates CTest Lab if it detects a _CMakeLists.txt_ file in your workspace.
When activated, CTest Lab adds the Testing view to the main toolbar. Open this
view to interact with your tests.

## Discovering Tests

Before you can run tests, you must tell CTest Lab to look for the tests. There
are three ways to discover tests:

1. CTest Lab attempts to discover tests when it activates.
1. You can run the `Test: Refresh Tests` command from the command palette.
1. You can click the `Refresh` button in the Testing view.

Test discovery requires that you have configured your project. CTest Lab runs
the [ctest command](https://cmake.org/cmake/help/latest/manual/ctest.1.html) to
get the list of available tests. This also means that CTest Lab may not be able
to discover some tests until you build them. For example, if you use
[Catch2's catch_discover_tests()](https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#automatic-test-registration)
command, the tests are not actually added until you build them. If the list of
tests does not look correct, try configuring and building your project, then
refresh the tests.

## Running Tests

After CTest Lab discovers your tests, you can run them in the Testing View. You
can run all your tests with one command, or run individual tests. Use the play
buttons in the Testing View to run tests. If a test fails, click the _Show
Output_ button in the Testing View. This shows the test output in an integrated
terminal.

<!-- prettier-ignore -->
> ❗ **WARNING**
>
> CTest Lab does not invoke `ctest` to run your tests; it runs the actual
> executables. Therefore, some features of CTest are not used. For example, if a
> test has the `REQUIRED_FILES` property defined, the test will run even if the
> files are not present. This is a temporary limitation; I plan to fix it in the
> next minor release.

## The Testing View

CTest Lab provides ways for you to interact with your tests in the Testing View.

### Test Tags

VS Code's test API provides support for test tags. Users can filter tests by tag
in the Testing view. CTest Lab checks your tests'
[`LABELS` properties](https://cmake.org/cmake/help/latest/prop_test/LABELS.html)
and adds all your labels as tags. In this example, if you filter
`@ctest-lab-tests:unit` in the VS Code Testing view, you will see `foo_test` and
`bar_test`. If you filter `@ctest-lab-tests:e2e`, you will only see
`end_to_end_test`.

```cmake
add_executable(foo_test foo_test.cpp)
add_test(NAME foo_test COMMAND foo_test)
add_executable(bar_test bar_test.cpp)
add_test(NAME bar_test COMMAND bar_test)
set_tests_properties(foo_test bar_test PROPERTIES LABELS "unit")

add_executable(end_to_end_test e2e_test.cpp)
add_test(NAME end_to_end_test COMMAND end_to_end_test)
set_tests_properties(end_to_end_test PROPERTIES LABELS "e2e")
```

### Disabled Tests

CTest Lab appends "(Disabled)" to the test name in the Testing view if the a
test's
[`DISABLED` property](https://cmake.org/cmake/help/latest/prop_test/DISABLED.html)
is set to `true`. CTest Lab also adds "disabled" to the list of test tags. This
allows you to quickly see which tests are disabled.

## Road Map

| Done? |                             Version                              | Description                                   |
| :---: | :--------------------------------------------------------------: | :-------------------------------------------- |
|  ✅   | [Version 0.1](https://github.com/brobeson/ctest-lab/milestone/1) | Implement test discovery                      |
|       | [Version 0.2](https://github.com/brobeson/ctest-lab/milestone/2) | Implement test execution                      |
|       | [Version 0.3](https://github.com/brobeson/ctest-lab/milestone/2) | Use `ctest` to execute tests                  |
|       | [Version 1.0](https://github.com/brobeson/ctest-lab/milestone/2) | Finalize functionality for production release |

---
title: Test View
layout: default
nav_order: 3
---


# Test View  <!-- markdownlint-disable-line single-h1 -->

CTest Lab provides ways for you to interact with your tests in the Test View.

<!-- prettier-ignore -->
<!--
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
-->

## Disabled Tests

CTest Lab appends "(Disabled)" to the test name in the Testing view if the a
test's
[`DISABLED` test property](https://cmake.org/cmake/help/latest/prop_test/DISABLED.html)
is set to `true`. This provides you a clear indication that a test will not run.

## Skipped Tests

CTest sometimes skips a test, usually when a required resource is unavailable.
When CTest skips a test, it sets the pass/fail status to failed and notes that
the test was "Not Run". CTest Lab also counts skipped tests as failed in the
Test View to be consistent with CTest's behavior.

## Test Fixtures

If you run an individual test, CTest Lab will run fixtures configured in your
CMake files. This occurs because CTest Lab effectively runs `ctest --tests-regex
...`. However, CTest Lab cannot update the pass/fail status of the fixtures in
the Test View. This is due to how VS Code's testing API works and I have not
figured out a work-around, yet.

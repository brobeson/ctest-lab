<!-- Jekyll and Github Pages process this file into a website. A level -->
<!-- heading is redundant in the produced HTML. -->
<!-- markdownlint-disable MD041 -->

<!-- prettier-ignore -->
> ❗ **WARNING**
>
> This extension is not ready for use, yet. It's in the marketplace to confirm
> that I can publish it. Watch for incremental functionality, coming soon.

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
When activated, CTest Lab adds the _Testing_ view to the main toolbar. Open this
view to interact with your tests.

## Road Map

| Done? | Version                                                          | Description                                   |
| :---- | :--------------------------------------------------------------- | :-------------------------------------------- |
|       | [Version 0.1](https://github.com/brobeson/ctest-lab/milestone/1) | Implement test discovery                      |
|       | [Version 0.2](https://github.com/brobeson/ctest-lab/milestone/2) | Implement test execution                      |
|       | [Version 1.0](https://github.com/brobeson/ctest-lab/milestone/2) | Finalize functionality for production release |

---
title: Home
layout: default
---

<!-- Jekyll and Github Pages process this file into a website. Markdown lint -->
<!-- incorrectly claims the document has multiple top-level headings. I      -->
<!-- assume it confuses the Jekyll configuration above for a heading.        -->
<!-- markdownlint-disable MD025 -->
# CTest Lab

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/brobeson.ctest-lab?label=Current%20Version)

{: .warning }
> This extension is still a preview lacking some major functionality.

## Why CTest Lab

There are other VS Code extensions tailored to specific test frameworks, such as
Catch2 or gtest. CTest is not restricted to compiled executables using those
frameworks, though. For example, you could have a test that runs a script to
verify installation of your package. You could have a CTest fixture that
downloads binary test data from the Internet. These types of tests and test
relationships are not captured by other extensions.

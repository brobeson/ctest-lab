import * as vscode from "vscode";
import { spawn } from "child_process";
import { get_build_directory } from "./extension_helpers";
import * as test_results from "./test_results";

const test_results_file = "test_results.xml";

/**
 * The run handler executes each requested test and reports the output
 * or errors to the VS Code Testing API via the TestRun interface. Tests
 * may be cancelled via the CancellationToken.
 * @param test_controller VS Code test controller
 * @param log VS Code extension output channel
 * @param run_request VS Code test run request
 * @param cancel_token VS Code cancellation token
 */
export async function run_tests(
  test_controller: vscode.TestController,
  log: vscode.OutputChannel,
  run_request: vscode.TestRunRequest,
  cancel_token: vscode.CancellationToken
) {
  const abort_controller = new AbortController();
  const { signal } = abort_controller;
  cancel_token?.onCancellationRequested(() => abort_controller.abort());

  const run = test_controller.createTestRun(run_request);
  const test_queue = get_test_list(run_request, test_controller);
  test_queue.forEach((test) => run.started(test));

  try {
    const command_result = await runCtestCommand(
      signal,
      log,
      test_queue.length === 1 ? test_queue[0].label : undefined
    );
    const result_data = await test_results.load_test_results(
      `${get_build_directory()}/${test_results_file}`
    );
    for (const test_result of result_data.results) {
      const test_item = find_test_item(test_queue, test_result.name);
      if (test_item !== null) {
        update_test(run, test_item, test_result);
      }
    }
    // VS Code displays the test output in a terminal so we need to wrap lines
    // using CRLF (\r\n), not just LF (\n)
    run.appendOutput(
      command_result.output.replaceAll("\r", "").replaceAll("\n", "\r\n")
    );
    log.show(true); // true -> output channel does not take focus
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
  run.end();
}

async function runCtestCommand(
  signal: AbortSignal,
  log: vscode.OutputChannel,
  testName?: string
): Promise<{ output: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const command = "ctest";
    const args = ["--output-on-failure", "--output-junit", test_results_file];
    if (testName) {
      args.push("--tests-regex", testName);
    }
    log.appendLine("\n\n" + command + " " + args.join(" "));
    const process = spawn(command, args, {
      signal,
      cwd: get_build_directory(),
    });

    let output = "";
    if (process.pid) {
      process.stdout.on("data", (data) => {
        log.append(data.toString());
        output += data.toString();
      });
      process.stderr.on("data", (data) => {
        log.append(data.toString());
        output += data.toString();
      });
      process.on("close", (code) => resolve({ output, code }));
      process.on("error", (err) => reject(err));
    } else {
      reject({ message: `Failed to run test ${command} ${args.join(" ")}` });
    }
  });
}

function find_test_item(test_queue: vscode.TestItem[], name: string) {
  for (const test of test_queue) {
    if (test.label === name) {
      return test;
    }
  }
  return null;
}

function update_test(
  run: vscode.TestRun,
  test: vscode.TestItem,
  result: test_results.TestResult
) {
  switch (result.status) {
    case test_results.ctest_status.run:
      run.passed(test, result.time);
      break;
    case test_results.ctest_status.notrun:
    // CTest categorizes "not run" tests as failed. These are tests that don't
    // run if they should have, but failed some prerequisite. An example is if
    // a required file is missing.
    case test_results.ctest_status.fail:
      run.failed(
        test,
        new vscode.TestMessage(result.output.join("\n")),
        result.time
      );
      break;
    case test_results.ctest_status.disabled:
      run.skipped(test);
      break;
    default:
      vscode.window.showWarningMessage(
        `Unknown CTest status found in test results: ${result.status}`
      );
      break;
  }
}

function get_test_list(
  run_request: vscode.TestRunRequest,
  controller: vscode.TestController
) {
  const test_queue: vscode.TestItem[] = [];
  if (run_request.include) {
    run_request.include.forEach((test) => test_queue.push(test));
  } else {
    controller.items.forEach((test) => test_queue.push(test));
  }
  return test_queue;
}

import * as vscode from "vscode";
import { spawn } from "child_process";
import { get_build_directory } from "./extension_helpers";

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
  const test_queue: vscode.TestItem[] = [];

  if (run_request.include) {
    run_request.include.forEach((test) => test_queue.push(test));
  } else {
    test_controller.items.forEach((test) => test_queue.push(test));
  }

  test_queue.forEach((test) => run.started(test));
  const start = Date.now();
  try {
    let result = await run_all_tests(signal, log);
    const elapsed = Date.now() - start;
    if (result.code !== null && result.code === 0) {
      test_queue.forEach((test) => run.passed(test, elapsed));
    } else {
      test_queue.forEach((test) =>
        run.failed(test, new vscode.TestMessage(""), elapsed)
      );
    }
    // VS Code displays the test output in a terminal so we need to wrap lines
    // using CRLF (\r\n), not just LF (\n)
    run.appendOutput(
      result.output.replaceAll("\r", "").replaceAll("\n", "\r\n")
    );
    log.show(true); // true -> output channel does not take focus
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
  }
  run.end();
}

const test_results_file = "test_results.xml";

async function run_all_tests(
  signal: AbortSignal,
  log: vscode.OutputChannel
): Promise<{ output: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const command = "ctest";
    const args = ["--output-on-failure", "--output-junit", test_results_file];
    log.appendLine(command + " " + args.join(" "));
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

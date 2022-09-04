import * as vscode from "vscode";
import { spawn } from "child_process";
import { get_build_directory } from "./extension_helpers";
import { test_details } from "./test_details";

async function run_test(
  test: vscode.TestItem,
  signal: AbortSignal,
  log: vscode.OutputChannel
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const test_detail = test_details.get(test)!;
    const command = test_detail.command[0];
    const args = test_detail.command.slice(1);
    const process = spawn(command, args, {
      signal,
      cwd: get_build_directory(),
    });

    let stdout =
      command + " " + args.map((val) => JSON.stringify(val)).join(" ") + "\n";
    let stderr = "";
    if (process.pid) {
      process.stdout.on("data", (data) => (stdout += data.toString()));
      process.stderr.on("data", (data) => (stderr += data.toString()));
      process.on("close", (code) => resolve({ stdout, stderr, code }));
      process.on("error", (err) => reject(err));
    } else {
      reject({ message: `Failed to run test ${command} ${args.join(" ")}` });
    }
  });
}

/**
 * The run handler executes each requested test and reports the output
 * or errors to the VS Code Testing API via the TestRun interface. Tests
 * may be cancelled via the CancellationToken.
 * @param test_controller VS Code test controller
 * @param log VS Code extension output channel
 * @param shouldDebug Should tests run in debug
 * @param request VS Code test run request
 * @param token VS Code cancellation token
 */
export async function run_tests(
  test_controller: vscode.TestController,
  log: vscode.OutputChannel,
  shouldDebug: boolean,
  request: vscode.TestRunRequest,
  token: vscode.CancellationToken
) {
  const abort_controller = new AbortController();
  const { signal } = abort_controller;
  token?.onCancellationRequested(() => abort_controller.abort());

  const run = test_controller.createTestRun(request);
  const test_queue: vscode.TestItem[] = [];

  if (request.include) {
    request.include.forEach((test) => test_queue.push(test));
  } else {
    test_controller.items.forEach((test) => test_queue.push(test));
  }

  while (test_queue.length > 0 && !token.isCancellationRequested) {
    const test = test_queue.pop()!;

    // Skip tests the user asked to exclude
    if (request.exclude?.includes(test)) {
      continue;
    }

    const start = Date.now();
    try {
      const { stdout, stderr, code } = await run_test(test, signal, log);
      // test output is in a terminal so lines must be wrapped
      // using CRLF (\r\n), not just LF (\n)
      run.appendOutput(stdout.replaceAll("\r", "").replaceAll("\n", "\r\n"));

      if (code === 0) {
        run.passed(test, Date.now() - start);
      } else {
        const message = new vscode.TestMessage(stderr);
        run.errored(test, message, Date.now() - start);
      }
    } catch (e: any) {
      run.failed(test, new vscode.TestMessage(e.message), Date.now() - start);
    }

    test.children.forEach((test) => test_queue.push(test));
  }

  run.end();
}

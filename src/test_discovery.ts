import * as vscode from "vscode";
import { spawn } from "child_process";

// https://cmake.org/cmake/help/latest/manual/ctest.1.html#show-as-json-object-model
export type CTestConfiguration = {
  kind: "ctestInfo";
  version: {
    major: number;
    minor: number;
  };
  backtraceGraph: {
    commands: string[];
    files: string[];
    nodes: {
      command?: number;
      file?: number;
      line?: number;
      parent?: number;
    }[];
  };
  tests: {
    name: string;
    config?: string;
    command: string[];
    backtrace: number;
    properties: { name: string; value: any }[];
  }[];
};

type TestDetails = {
  command: string[];
};

const test_details = new WeakMap<vscode.TestItem, TestDetails>();

/**
 * Discover tests and populate the test controller with test items.
 * When called multiple times, it will replace all previous test items
 * with the newly discovered tests.
 * Can be used as the refreshHandler of a TestController.
 * @param test_controller VS Code test controller
 * @param log VS Code out put channel
 * @param token VS Code cancellation token
 *
 * @returns A promise which resolves when the the tests have been refreshed or has failed to do so.
 */
export async function refresh_tests(
  test_controller: vscode.TestController,
  log: vscode.OutputChannel,
  token?: vscode.CancellationToken
): Promise<void> {
  return new Promise<void>((resolve) => {
    log.append("Discovering tests... ");
    const controller = new AbortController();
    const { signal } = controller;
    token?.onCancellationRequested(() => controller.abort());
    run_ctest_show_only_json(signal)
      .then((value) => {
        if (value.stderr.length > 0) {
          log.appendLine(value.stderr);
        }
        if (value.code !== 0) {
          log.appendLine(`ctest failed with code ${value.code}`);
          resolve();
          return;
        }
        return JSON.parse(value.stdout) as CTestConfiguration;
      })
      .then((config) => {
        if (config === undefined) {
          return;
        }

        let tests: vscode.TestItem[] = [];
        let id = 0;
        for (const test of config.tests) {
          // if two tests have the same name, their ids will be the same. Added
          // a serial id to differentiate colliding names
          let test_item = test_controller.createTestItem(
            `${id++}-${test.name}`,
            test.name
          );
          test_item.tags = get_test_tags(test.properties);
          test_item.description = get_test_description(test.properties);
          tests.push(test_item);

          test_details.set(test_item, { command: test.command });
        }
        test_controller.items.replace(tests);
        log.appendLine(`found ${test_controller.items.size} tests`);
        resolve();
      })
      .catch((err) => {
        log.appendLine(`Error: ${err.message}`);
        resolve();
      });
  });
}

function run_ctest_show_only_json(
  signal: AbortSignal
): Promise<{ stdout: string; stderr: string; code: number | null }> {
  return new Promise((resolve, reject) => {
    const process = spawn("ctest", ["--show-only=json-v1"], {
      signal,
      cwd: get_build_directory(),
    });
    let stdout = "";
    let stderr = "";
    if (process.pid) {
      process.stdout.on("data", (data) => (stdout += data.toString()));
      process.stderr.on("data", (data) => (stderr += data.toString()));
      process.on("close", (code) => resolve({ stdout, stderr, code }));
      process.on("error", (err) => reject(err));
    } else {
      reject({ message: "Failed to run ctest" });
    }
  });
}

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
  const queue: vscode.TestItem[] = [];

  if (request.include) {
    request.include.forEach((test) => queue.push(test));
  } else {
    test_controller.items.forEach((test) => queue.push(test));
  }

  while (queue.length > 0 && !token.isCancellationRequested) {
    const test = queue.pop()!;

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

    test.children.forEach((test) => queue.push(test));
  }

  run.end();
}

function get_build_directory(): string {
  let build_directory: string = "";
  let config = vscode.workspace.getConfiguration("cmake");
  if (config.has("buildDirectory")) {
    build_directory = config.get("buildDirectory") as string;
  } else {
    config = vscode.workspace.getConfiguration("ctest-lab");
    build_directory = config.get("buildDirectory") as string;
  }
  return replace_code_variables(build_directory);
}

function replace_code_variables(path: string): string {
  if (vscode.workspace.workspaceFolders) {
    const workspaceFolder: string =
      vscode.workspace.workspaceFolders[0].uri.fsPath;
    return path.replace("${workspaceFolder}", workspaceFolder);
  }
  return path;
}

function get_test_tags(test_properties: any): vscode.TestTag[] {
  let tags: vscode.TestTag[] = [];
  const labels = get_property_value(test_properties, "LABELS");
  if (labels) {
    for (const label of labels) {
      tags.push(new vscode.TestTag(label));
    }
  }
  if (get_property_value(test_properties, "DISABLED")) {
    tags.push(new vscode.TestTag("disabled"));
  }
  return tags;
}

function get_test_description(test_properties: Object): string {
  let description: string = "";
  const disabled = get_property_value(test_properties, "DISABLED");
  if (disabled) {
    description = "(disabled)";
  }
  return description;
}

function get_property_value(properties: any, property_name: string) {
  for (const test_property of properties) {
    if (test_property.name === property_name) {
      return test_property.value;
    }
  }
  return undefined;
}

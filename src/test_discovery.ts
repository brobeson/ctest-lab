import * as vscode from "vscode";
import { spawn } from "child_process";
import { get_build_directory } from "./extension_helpers";
import { test_details } from "./test_details";

// https://cmake.org/cmake/help/latest/manual/ctest.1.html#show-as-json-object-model
type CTestConfiguration = {
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

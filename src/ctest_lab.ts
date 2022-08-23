import * as vscode from "vscode";
import { spawn } from "child_process";

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

export async function discover_tests(test_controller: vscode.TestController, log_channel: vscode.OutputChannel) {
  log_channel.appendLine("Discovering tests... ");
  run_ctest_show_only(log_channel)
    .then(ctest_output_string => {
      const ctest_output = JSON.parse(ctest_output_string) as CTestConfiguration;
      for (const test of ctest_output.tests) {
        let test_item = test_controller.createTestItem(test.name, test.name);
        test_item.tags = get_test_tags(test.properties);
        test_item.description = get_test_description(test.properties);
        test_controller.items.add(test_item);
      }
      log_channel.appendLine(`found ${test_controller.items.size} tests`);
    })
    .catch(err => log_channel.appendLine(err.message));
}


function run_ctest_show_only(log_channel: vscode.OutputChannel): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn("ctest", ["--show-only=json-v1"], { cwd: get_build_directory() });
    let stdout = "";
    let stderr = "";
    if (process.pid) {
      process.stdout.on("data", data => {
        stdout += data;
      });
      process.stdout.on("end", () => {
        resolve(stdout);
      });
      process.stderr.on("data", data => {
        stderr += data;
      });
      process.stderr.on("end", () => {
        if (stderr.length > 0) {
          log_channel.appendLine(stderr);
        }
      });
      process.on("error", err => {
        reject(err);
      });
    } else {
      reject({message: "Failed to run ctest"});
    }
  });
}


function get_build_directory(): string {
  // return "/home/brobeson/repositories/track-fusion/build";
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
    const workspaceFolder: string = vscode.workspace.workspaceFolders[0].uri.fsPath;
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
  return tags;
}


function get_test_description(test_properties: Object): string {
  let description: string = "";
  const disabled = get_property_value(test_properties, "DISABLED");
  if (disabled) {
    description = "disabled";
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

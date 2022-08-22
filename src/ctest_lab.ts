import * as vscode from "vscode";
import { spawn } from "child_process";

export async function discover_tests(test_controller: vscode.TestController, log_channel: vscode.OutputChannel) {
  log_channel.appendLine("Discovering tests...");
  const ctest_output = await run_ctest_show_only(log_channel);
  const lines = ctest_output.trim().split('\n');
  for (const line of lines) {
    if (line.match(/\s+Test\s+#/)) {
      const i = line.indexOf(":");
      const case_name = line.substring(i + 1).trim();
      test_controller.items.add(test_controller.createTestItem(case_name, case_name));
    }
  }
  log_channel.appendLine(`Found ${test_controller.items.size} tests.`);
}

function run_ctest_show_only(log_channel: vscode.OutputChannel): Promise<string> {
  log_channel.appendLine("ctest --show-only");
  return new Promise((resolve, reject) => {
    const process = spawn("ctest", ["--show-only"], { cwd: get_build_directory() });
    let stdout = "";
    let stderr = "";
    if (process.pid) {
      process.stdout.on("data", data => {
        stdout += data;
      });
      process.stdout.on("end", () => {
        log_channel.appendLine(stdout);
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
        log_channel.appendLine(err.message);
        reject(err);
      });
    } else {
      log_channel.appendLine("Failed to run ctest");
    }
  });
}


function get_build_directory(): string {
  return "/home/brendan/repositories/tracking-analyzer/build";
  let build_directory = vscode.workspace.getConfiguration("cmake").get("buildDirectory");
  if (build_directory === undefined) {
    build_directory = vscode.workspace.getConfiguration("ctest-lab").get("buildDirectory");
  }
  // The extension guarantees that 'ctest-lab.buildDirectory' will exist.
  return build_directory as string;
}
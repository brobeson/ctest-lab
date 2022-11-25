import * as vscode from "vscode";
import * as ctest from "./test_discovery";
import { run_tests } from "./test_runner";

export function activate(context: vscode.ExtensionContext) {
  let log_channel = vscode.window.createOutputChannel("CTest");
  context.subscriptions.push(log_channel);
  log_channel.appendLine("CTest Lab is available.");

  const cmakeToolsAvailable =
    vscode.extensions.getExtension("ms-vscode.cmake-tools") !== undefined;

  const controller = vscode.tests.createTestController(
    "ctest-lab-tests",
    "CTest"
  );
  context.subscriptions.push(controller);

  controller.refreshHandler = (token: vscode.CancellationToken) =>
    ctest.refresh_tests(controller, log_channel, token);

  controller.createRunProfile(
    "Run",
    vscode.TestRunProfileKind.Run,
    (request, token) => {
      run_tests(controller, log_channel, request, token, cmakeToolsAvailable);
    }
  );

  ctest.refresh_tests(controller, log_channel);
}

export function deactivate() {}

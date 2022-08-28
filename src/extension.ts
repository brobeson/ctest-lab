// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as ctest from "./ctest_lab";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let log_channel = vscode.window.createOutputChannel("CTest");
  context.subscriptions.push(log_channel);
  log_channel.appendLine("CTest Lab is available.");

  if (vscode.workspace.getConfiguration("cmake").get("buildDirectory") === undefined) {
    vscode.window.showWarningMessage("Setting 'cmake.buildDirectory' not found. Falling back to 'ctest-lab.buildDirectory'.");
  }

  const controller = vscode.tests.createTestController("ctest-lab-tests", "CTest");
  controller.refreshHandler = (token: vscode.CancellationToken) =>
    ctest.refresh_tests(controller, log_channel, token);

  context.subscriptions.push(controller);
  const discover_tests = () => ctest.refresh_tests(controller, log_channel);
  discover_tests();

  context.subscriptions.push(
    vscode.commands.registerCommand("ctest.discoverTests", discover_tests)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}

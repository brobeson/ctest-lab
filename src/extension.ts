// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { discover_tests } from './ctest_lab';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let log_channel = vscode.window.createOutputChannel('CTest');
	context.subscriptions.push(log_channel);
	log_channel.appendLine("CTest Lab is available.");

	const controller = vscode.tests.createTestController("ctest-lab-tests", "CTest");
	context.subscriptions.push(controller);

	discover_tests(controller, log_channel);
}

// this method is called when your extension is deactivated
export function deactivate() { }

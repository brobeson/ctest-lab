// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ctest-lab" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ctest-lab.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const config = vscode.workspace.getConfiguration("cmake");
		if (config.has("buildDirectory")) {
			vscode.window.showInformationMessage(`Reading tests from ${config.get("buildDirectory")}`);
		} else {
			vscode.window.showErrorMessage("No cmake.buildDirectory defined.");
		}
	});

	context.subscriptions.push(disposable);

	const controller = vscode.tests.createTestController("ctest-lab-tests", "CTest");
	context.subscriptions.push(controller);

	const ctest_output = `Test project /home/brendan/repositories/tracking-analyzer/build
	Test #1: bounding_box_test
	Test #2: dataset_test
	Test #3: exceptions_test
	Test #4: filesystem_test
	Test #5: results_database_test
	Test #6: sequence_results_test
	Test #7: tracker_results_test
	Test #8: training_metadata_test
	`;
	const lines = ctest_output.trim().split('\n');
	for (const line of lines) {
		if (line.trim().startsWith("Test #")) {
			const i = line.indexOf(":")
			const case_name = line.substring(i + 1).trim()
			controller.items.add(controller.createTestItem(case_name, case_name))
		}
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }

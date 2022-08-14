import * as vscode from "vscode";

export async function discover_tests(test_controller: vscode.TestController, log_channel: vscode.OutputChannel) {
  log_channel.appendLine("Discovering tests...");

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
      const i = line.indexOf(":");
      const case_name = line.substring(i + 1).trim();
      test_controller.items.add(test_controller.createTestItem(case_name, case_name));
    }
  }
}
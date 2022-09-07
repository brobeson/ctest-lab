import * as vscode from "vscode";

type TestDetails = {
  command: string[];
};

export const test_details = new WeakMap<vscode.TestItem, TestDetails>();

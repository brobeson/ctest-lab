import * as fs from "fs";
import * as xml2js from "xml2js";

// Map more canonical status names to the CTest names found in the XML.
export enum ctest_status {
  run = "run",
  fail = "fail",
  disabled = "disabled",
  notrun = "notrun",
}

export async function load_test_results(results_file: string) {
  const xml = fs.readFileSync(results_file).toString();
  const raw_results = await xmlResultsToJson(xml);
  return postProcessJson(raw_results);
}

export type TestResult = {
  name: string;
  status: string;
  time: number;
  output: Array<string>;
};

export type TestResults = {
  tests: number;
  failures: number;
  disabled: number;
  skipped: number;
  passed: number;
  results: TestResult[];
};

function xmlResultsToJson(xml: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (parseError: any, jsonResult: Object) => {
      if (parseError) {
        reject(parseError);
      } else {
        resolve(jsonResult);
      }
    });
  });
}

function postProcessJson(jsonResults: any) {
  let r: TestResults = {
    tests: Number(jsonResults.testsuite.$.tests),
    failures: Number(jsonResults.testsuite.$.failures),
    disabled: Number(jsonResults.testsuite.$.disabled),
    skipped: Number(jsonResults.testsuite.$.skipped),
    passed: 0,
    results: postProcessTests(jsonResults.testsuite.testcase),
  };
  r.passed = r.tests - (r.failures + r.disabled + r.skipped);
  return r;
}

function postProcessTests(testCases: any[]) {
  let c = [];
  for (const test_case of testCases) {
    c.push({
      name: test_case.$.name,
      status: test_case.$.status,
      time: test_case.$.time * 1000,
      output: test_case["system-out"],
    });
  }
  return c;
}

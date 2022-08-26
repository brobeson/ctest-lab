// https://cmake.org/cmake/help/latest/manual/ctest.1.html#show-as-json-object-model
export type CTestConfiguration = {
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

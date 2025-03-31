export const expectedGroupedGraph = {
  "/test/main.js": {
    variables: {
      result: {
        file: "/test/main.js",
        varName: "result",
        originalDefinition: "const result = helper();",
        position: {
          line: 3,
          column: 10
        },
        usages: [
          {
            code: "result",
            fullLine: "console.log(result);",
            file: "/test/main.js",
            position: {
              line: 5,
              column: 16
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        transformations: []
      },
      test: {
        file: "/test/main.js",
        varName: "test",
        originalDefinition: "const test = \"Victor\";",
        position: {
          line: 4,
          column: 10
        },
        usages: [],
        transformations: []
      }
    },
    imports: {
      helper: {
        file: "/test/main.js",
        varName: "helper",
        originalDefinition: "import { helper } from './helper.js';",
        position: {
          line: 2,
          column: 4
        },
        usages: [
          {
            code: "helper",
            fullLine: "const result = helper();",
            file: "/test/main.js",
            position: {
              line: 3,
              column: 19
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        importType: "import",
        importedAs: "helper",
        importedFrom: "./helper.js",
        importedFromFile: "/test/helper.js",
        transformations: []
      }
    },
    exports: {}
  },
  "/test/helper.js": {
    variables: {},
    imports: {},
    exports: {
      helper: {
        file: "/test/helper.js",
        varName: "helper",
        originalDefinition: "export function helper() {",
        position: {
          line: 2,
          column: 4
        },
        usages: [
          {
            code: "import { helper } from '/test/helper.js';",
            fullLine: "import { helper } from '/test/helper.js';",
            file: "/test/main.js",
            position: {
              line: 2,
              column: 4
            },
            type: "usage",
            details: {
              context: "expression"
            }
          },
          {
            code: "helper",
            fullLine: "const result = helper();",
            file: "/test/main.js",
            position: {
              line: 3,
              column: 19
            },
            type: "usage",
            details: {
              context: "expression"
            }
          }
        ],
        exportType: "exportNamed",
        exportedAs: "helper",
        transformations: []
      }
    }
  }
};
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
            fullLine: "const { res } = result;",
            file: "/test/main.js",
            position: {
              line: 4,
              column: 20
            },
            type: "usage",
            details: {
              context: "expression"
            }
          },
          {
            code: "result",
            fullLine: "console.log(result);",
            file: "/test/main.js",
            position: {
              line: 6,
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
      res: {
        file: "/test/main.js",
        varName: "res",
        originalDefinition: "const { res } = result;",
        position: {
          line: 4,
          column: 10
        },
        usages: [],
        transformations: [],
        derivedFrom: "result"
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
          },
          {
            code: "export function helper() {",
            file: "/test/helper.js",
            position: {
              line: 2,
              column: 4
            },
            type: "imported_usage",
            details: {
              context: "import"
            }
          }
        ],
        transformations: [],
        importType: "import",
        importName: "helper",
        importedFrom: "./helper.js",
        importedFromFile: "/test/helper.js"
      }
    },
    exports: {
      test: {
        file: "/test/main.js",
        varName: "test",
        originalDefinition: "export const test = \"Victor\";",
        position: {
          line: 5,
          column: 4
        },
        usages: [],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "test",
        exportedFromFile: "/test/main.js"
      }
    }
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
            code: "helper",
            fullLine: "import { helper } from './helper.js';",
            file: "/test/main.js",
            position: {
              line: 2,
              column: 4
            },
            type: "exported_usage",
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
            },
            nestedUsages: [
              {
                code: "result",
                fullLine: "const { res } = result;",
                file: "/test/main.js",
                position: {
                  line: 4,
                  column: 20
                },
                type: "usage",
                details: {
                  context: "expression"
                }
              },
              {
                code: "result",
                fullLine: "console.log(result);",
                file: "/test/main.js",
                position: {
                  line: 6,
                  column: 16
                },
                type: "usage",
                details: {
                  context: "expression"
                }
              }
            ]
          }
        ],
        transformations: [],
        exportType: "exportNamed",
        exportedAs: "helper",
        exportedFromFile: "/test/helper.js"
      }
    }
  }
};
import { ContextAnalyzer } from "./ContextAnalyzer";
import fs from "fs/promises";
import path from "node:path";

jest.mock("fs/promises");

const mockFiles: Record<string, string> = {
  "/test/main.js": `
    import { helper } from './helper.js';
    const result = helper();
    console.log(result);
  `,
  "/test/helper.js": `
    export function helper() {
      return "Hello, World!";
    }
  `,
};


fs.readFile = jest.fn(async (filePath: string) => {
  const normalizedPath = path.resolve(filePath);
  if (mockFiles[normalizedPath]) return mockFiles[normalizedPath];
  throw new Error(`File not found: ${filePath}`);
}) as any;

// Expected graph tracking how `helper` flows into `result` and is logged
const expectedGraph = {
  "/test/main.js": {
    imports: {
      "./helper.js": { type: "import", specifiers: ["helper"] },
    },
    variables: {
      result: {
        file: "/test/main.js",
        originalDefinition: "const result = helper();",
        usages: [
          { file: "/test/main.js", type: "usage", code: "console.log(result);" },
        ],
        transformations: [],
      },
    },
  },
};

describe("ContextAnalyzer - Single Entrypoint", () => {
  let analyzer: ContextAnalyzer;

  beforeEach(() => {
    analyzer = new ContextAnalyzer();
  });

  test("tracks how variables are used across the file", async () => {
    await analyzer.analyzeEntrypoints(["/test/main.js"]);

    const actualGraph = analyzer["tracker"].getGraph();
    expect(actualGraph).toEqual(expectedGraph);
  });
});

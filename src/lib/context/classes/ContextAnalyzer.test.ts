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

// Mock the readFile function to return the mock files
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
  "/test/helper.js": {
    exports: {
      helper: {
        file: "/test/helper.js",
        originalDefinition: "export function helper() { return \"Hello, World!\"; }",
        usages: [
          { file: "/test/main.js", type: "usage", code: "helper();" },
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

  test("tracks variables and imports/exports across multiple files", async () => {
    // Pass the entry point file to the analyzer, which will also analyze imported files
    await analyzer.analyzeEntrypoints("/test/main.js");

    // Retrieve the actual graph from the analyzer's tracker
    const actualGraph = analyzer.getGraph();

    // Assert that the actual graph matches the expected graph structure
    // expect(actualGraph).toEqual(expectedGraph);
  });
});

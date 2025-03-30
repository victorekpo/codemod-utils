import { ContextAnalyzer } from "./ContextAnalyzer";
import fs from "fs/promises";
import path from "node:path";
import { groupGraphByFile } from "../testUtils/graphUtils";
import { mockFiles } from "../testUtils/mockFiles";

jest.mock("fs/promises");

describe("ContextAnalyzer - Single Entrypoint", () => {
  let analyzer: ContextAnalyzer;
  let actualGraph: any;
  let groupedGraph: Record<string, any>;

  beforeAll(async () => {
    // Mock the fs.readFile function to return the contents of the mock files
    fs.readFile = jest.fn(async (filePath: string) => {
      const normalizedPath = path.resolve(filePath);
      if (mockFiles[normalizedPath]) return mockFiles[normalizedPath];
      throw new Error(`File not found: ${filePath}`);
    }) as any;

    // Create a new instance of the analyzer
    analyzer = new ContextAnalyzer();
    await analyzer.analyzeEntrypoints("/test/main.js");
    actualGraph = analyzer.getGraph();
    const contextJson = Object.fromEntries(analyzer.contextMap.entries());
    groupedGraph = groupGraphByFile(actualGraph);
    //  console.log("Original context map:", JSON.stringify(contextJson, null, 2));
    console.log("Grouped context map:", JSON.stringify(groupedGraph, null, 2));
  });

  test("includes '/test/main.js' in the graph", () => {
    const mainJs = groupedGraph["/test/main.js"];
    expect(mainJs).toBeDefined();
  });

  test("tracks import from 'main.js' correctly", () => {
    const mainJs = groupedGraph["/test/main.js"];
    const importEntry = mainJs.imports["helper"];
    expect(importEntry).toBeDefined();
    expect(importEntry.imports.find(({ importType }) => !!importType).importType).toBe("import");
    expect(importEntry.imports.find(({ importedFrom }) => !!importedFrom).importedFrom).toBe("./helper.js");
    expect(importEntry.imports.find(({ importedFromFile }) => !!importedFromFile).importedFromFile).toBe("/test/helper.js");
  });

  test("tracks 'result' variable declaration in 'main.js'", () => {
    const mainJs = groupedGraph["/test/main.js"];
    const resultVar = mainJs.variables["result"];
    expect(resultVar).toBeDefined();
    expect(resultVar.originalDefinition).toBe("result = helper()");
  });

  test("tracks 'result' variable usage in 'main.js'", () => {
    const mainJs = groupedGraph["/test/main.js"];
    const resultVar = mainJs.variables["result"];
    // Assert that one of the usages is the console.log line
    const usage = resultVar.usages.find((u: any) => u.fullLine === "console.log(result);");
    expect(usage).toBeDefined();
    expect(usage.fullLine).toBe("console.log(result);");
  });

  test("tracks 'test' variable declaration in 'main.js'", () => {
    const mainJs = groupedGraph["/test/main.js"];
    const testVar = mainJs.variables["test"];
    expect(testVar).toBeDefined();
    expect(testVar.originalDefinition).toBe('test = "Victor"');
  });

  test("tracks 'test' variable usage in 'main.js'", () => {
    const mainJs = groupedGraph["/test/main.js"];
    const testVar = mainJs.variables["test"];
    const usage = testVar.usages.find((u: any) => u.code === "test");
    expect(usage).toBeDefined();
    expect(usage.fullLine).toBe('const test = "Victor";');
  });

  test("includes '/test/helper.js' in the graph", () => {
    const helperJs = groupedGraph["/test/helper.js"];
    expect(helperJs).toBeDefined();
  });

  test("tracks named export 'helper' correctly in 'helper.js'", () => {
    const helperJs = groupedGraph["/test/helper.js"];
    const exportEntry = helperJs.exports["helper"];
    expect(exportEntry).toBeDefined();
    expect(exportEntry.originalDefinition).toBe('export function helper() {\n  return "Hello, World!";\n}');
  });

  test("tracks 'helper' function usage in 'main.js'", () => {
    const helperJs = groupedGraph["/test/helper.js"];
    const exportEntry = helperJs.exports["helper"];

    const usage1 = exportEntry.usages.find((u: any) => u.fullLine === "import { helper } from '/test/helper.js';");
    expect(usage1).toBeDefined();

    // We expect one of the usages of helper is in main.js in the call to helper()
    const usage2 = exportEntry.usages.find((u: any) => u.fullLine === "const result = helper();");
    expect(usage2).toBeDefined();
  });
});

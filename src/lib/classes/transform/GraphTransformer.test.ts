import { DependencyGraph, TransformationConfig } from "../../../@types/GraphTransformer";
import { GraphTransformer } from "./GraphTransformer";
import fs from 'node:fs';
import path from 'node:path';
import { mockFiles } from '../../../testUtils/context/mockFiles';

jest.mock('node:fs'); // Mock fs module

describe('GraphTransformer', () => {
  let transformer: GraphTransformer;
  let testGraph: DependencyGraph;
  let transformationConfig: TransformationConfig;

  beforeAll(() => {
    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock) = jest.fn((filePath: string) => {
      const normalizedPath = path.resolve(filePath).replace(/\\/g, '/');
      if (mockFiles[normalizedPath]) return mockFiles[normalizedPath];
      throw new Error(`File not found: ${filePath}`);
    });

    // Mock fs.writeFileSync (log only, no mutation)
    (fs.writeFileSync as jest.Mock) = jest.fn((filePath: string, content: string) => {
      const normalizedPath = path.resolve(filePath).replace(/\\/g, '/');
      console.log("Updated code for:", normalizedPath, "\n", content);
    });

    testGraph = {
      '/test/main.js': {
        variables: {
          username: {
            originalDefinition: { file: '/test/main.js', position: { line: 8, column: 10 } },
            usages: [
              { file: '/test/main.js', position: { line: 8, column: 10 } },
              { file: '/test/main.js', position: { line: 10, column: 6 } }
            ],
            nestedUsages: [
              { file: '/test/main.js', position: { line: 8, column: 10 } }
            ],
            exportedFromFile: '/test/helper.js',
            importedFrom: '/test/helper.js'
          }
        }
      }
    };

    transformationConfig = {
      action: "rename",
      actionProps: {
        variableToTarget: "username",
        newName: "user"
      }
    };

    transformer = new GraphTransformer(testGraph);
    transformer.setConfig(transformationConfig);
  });

  test('should apply transformation to a specific file', () => {
    const mockTransformationFn = jest.fn();
    transformer.applyTransformation('/test/main.js', {
      line: 8,
      column: 10
    }, 'username', mockTransformationFn);

    expect(mockTransformationFn).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching('/test/main.js'),
      expect.stringContaining('user'),
      "utf-8"
    );
  });

  test('should process variable usage correctly', () => {
    const variable = testGraph['/test/main.js'].variables.username;
    transformer.processVariableUsage(variable, 'username', testGraph, transformationConfig);

    // Since it's renaming the variable, let's check if the mock transformation function is being applied
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringMatching('/test/main.js'),
      expect.stringContaining('user'),
      "utf-8"
    );
  });

  test('should process the dependency graph and rename variables', () => {
    transformer.processDependencyGraph();

    // Check if fs.writeFileSync was called for the transformed files
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('should handle missing file correctly in readFileSync', () => {
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
      throw new Error("File not found: /test/nonexistent.js");
    });

    expect(() => {
      transformer.applyTransformation('/test/nonexistent.js', { line: 1, column: 1 }, 'username', jest.fn());
    }).toThrow("File not found: /test/nonexistent.js");
  });
});

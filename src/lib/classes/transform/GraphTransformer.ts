import jscodeshift from 'jscodeshift';
import fs from 'node:fs';
import { resolve } from 'node:path';
import type { DependencyGraph, Position, TransformationConfig, Variable } from "../../../@types";

export class GraphTransformer {
  public dependencyGraph: DependencyGraph;
  public transformConfig: TransformationConfig;

  constructor(graph?: DependencyGraph, config?: TransformationConfig) {
    if (graph) {
      this.dependencyGraph = graph;
    }
    if (config) {
      this.transformConfig = config;
    }
  }

  // Apply transformation to a specific file at a given position
  applyTransformation(filePath: string, position: Position, variableName: string, transformationFn: (path: any) => void): void {
    const code = fs.readFileSync(resolve(filePath), 'utf-8');
    let ast = jscodeshift(code);

    console.log("Processing file:", filePath);
    // Find the node at the specified position and apply the transformation function
    ast
      .find(jscodeshift.Identifier, { name: variableName })
      .filter((path: any) => {
        if (!position) {
          console.log("No Position:", position, filePath, variableName);
        }

        const found = path.node.loc.start.line === position?.line && path.node.loc.start.column === position.column;
        console.log("Found:", found, "at", path.node.loc.start.line, position.line, "column", path.node.loc.start.column, position.column, "for", variableName);
        return found;
      })
      .forEach((path: any) => {
        console.log("Transforming:", path.node.name);
        transformationFn(path);
      });

    const transformedCode = ast.toSource();
    fs.writeFileSync(resolve(filePath), transformedCode, 'utf-8');
  }

  // Method to process the variable's usages and nested usages based on the dependency graph
  processVariableUsage(variable: Variable, variableName: string, dependencyGraph: DependencyGraph, transformationConfig: TransformationConfig): void {
    const filePath = variable.originalDefinition.file;

    // Only proceed if the action is rename
    if (transformationConfig.action === "rename") {
      const { variableToTarget, newName } = transformationConfig.actionProps;

      if (variableToTarget === variableName) {
        console.log("Processing main variable:", variableName, "to", newName);
        // Process original definition in the current file
        this.applyTransformation(filePath, variable.originalDefinition.position, variableName, (path) => {
          path.node.name = newName;
        });

        // Process each usage
        variable.usages.forEach(usage => {
          console.log("Processing usage:", usage.file, usage.position);
          this.applyTransformation(usage.file, usage.position, variableName, (path) => {
            path.node.name = newName;
          });
        });

        // Process nested usages
        variable.nestedUsages.forEach(nestedUsage => {
          console.log("Processing nested usage:", nestedUsage.file, nestedUsage.position);
          this.applyTransformation(nestedUsage.file, nestedUsage.position, variableName, (path) => {
            path.node.name = newName;
          });
        });

        // // Process exports
        // if (variable.exportedFromFile) {
        //   console.log("Processing export:", variable.exportedFromFile, variable.position);
        //   // Apply transformation to the exported file
        //   this.applyTransformation(variable.exportedFromFile, variable.position, variableName, (path) => {
        //     path.node.name = newName;
        //   });
        // }
        //
        // // Process imports
        // if (variable.importedFrom) {
        //   console.log("Processing import:", variable.importedFrom, variable.position);
        //   // Apply transformation to the imported file
        //   this.applyTransformation(variable.importedFrom, variable.position, variableName, (path) => {
        //     path.node.name = newName;
        //   });
        // }
      }
    }
  }

  // Method to iterate over the dependency graph and process all variables
  processDependencyGraph(): void {
    Object.entries(this.dependencyGraph).forEach(([filePath, fileData]) => {
      Object.entries(fileData.variables).forEach(([variableName, variable]) => {
        this.processVariableUsage(variable, variableName, this.dependencyGraph, this.transformConfig);
      });
    });
  }


  setGraph(graph: DependencyGraph) {
    this.dependencyGraph = graph;
  }

  setConfig(config: TransformationConfig) {
    this.transformConfig = config;
  }
}

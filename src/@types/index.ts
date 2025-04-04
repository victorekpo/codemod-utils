export interface Position {
  line: number;
  column: number;
}

export interface VariableUsage {
  file: string;
  position: Position;
}

export interface Variable {
  originalDefinition: { file: string; position: Position };
  usages: VariableUsage[];
  nestedUsages: VariableUsage[];
  exportedFromFile?: string;
  importedFrom?: string;
}

export interface DependencyGraph {
  [filePath: string]: {
    variables: { [variableName: string]: Variable };
  };
}

export interface TransformationConfig {
  action: string;
  actionProps: {
    variableToTarget: string;
    newName: string;
  };
}
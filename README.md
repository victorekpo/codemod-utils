# Codemod Utils

Codemod Utils is a utility library designed to assist with code modifications and transformations. It provides tools for
analyzing and transforming code, particularly focusing on dependency graphs and abstract syntax trees (ASTs).

## Installation

To install the library, use npm:

```sh
npm install codemod-utils
```

## Usage

### ContextAnalyzer

The `ContextAnalyzer` class is used to analyze the context of code files, tracking variables, imports, and exports. It
helps in understanding the structure and dependencies within a codebase.

```typescript
import { ContextAnalyzer } from 'codemod-utils';

const analyzer = new ContextAnalyzer();
await analyzer.analyzeEntrypoints('/path/to/entrypoint.js', false, false);
const graph = analyzer.convertGraphToObject();
console.log(graph);
```

### GraphTransformer

The `GraphTransformer` class is used to transform dependency graphs. It allows you to apply transformations such as
renaming variables across the entire codebase.

```typescript
import { GraphTransformer, TransformationConfig, DependencyGraph } from 'codemod-utils';

const testGraph: DependencyGraph = {
  'codeToMigrate/migrated/index.js': {
    variables: {
      username: {
        originalDefinition: { file: 'codeToMigrate/migrated/index.js', position: { line: 9, column: 6 } },
        usages: [
          { file: 'codeToMigrate/migrated/index.js', position: { line: 9, column: 6 } },
          { file: 'codeToMigrate/migrated/index.js', position: { line: 11, column: 6 } }
        ],
        nestedUsages: [
          { file: 'codeToMigrate/migrated/index.js', position: { line: 9, column: 6 } }
        ],
        exportedFromFile: 'codeToMigrate/migrated/file2.js',
        importedFrom: 'codeToMigrate/migrated/file2.js'
      }
    }
  }
};

const transformationConfig: TransformationConfig = {
  action: "rename",
  actionProps: {
    variableToTarget: "username",
    newName: "user"
  }
};

const transformer = new GraphTransformer(testGraph);
transformer.setConfig(transformationConfig);
transformer.processDependencyGraph();
```

### AST Classes

The library also provides several classes for working with abstract syntax trees (ASTs). These classes help in creating,
modifying, and analyzing AST nodes.

[Learn more](./src/lib/classes/ast/base/README.md)
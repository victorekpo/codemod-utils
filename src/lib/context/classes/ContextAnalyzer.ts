// This class uses recast and ast-types to walk through a file's AST,
// uses a helper Scope class for variable resolution, and uses ContextTracker
// to record all events related to variable definitions, usages, transformations, etc.

import recast from "recast";
import { visit, Visitor, namedTypes as n } from "ast-types";
import fs from "node:fs";
import path from "node:path";
import fastGlob from "fast-glob";

import { Scope } from "./Scope";
import { ContextTracker } from "./ContextTracker";
import { Identifier } from "../../ast/classes/base/Identifier";

export class ContextAnalyzer {
  private tracker: ContextTracker;

  constructor() {
    // Create a single tracker instance for this analysis
    this.tracker = new ContextTracker();
  }

  /**
   * Analyze a single file and update the dependency graph.
   * @param {string} filePath - Path to the file.
   */
  analyzeFile(filePath: string): void {
    const code = fs.readFileSync(filePath, "utf-8");
    const ast = recast.parse(code, { parser: require("recast/parsers/babel-ts") });

    // Create a local scope for the file.
    let currentScope: Scope = new Scope();

    const pushScope = () => {
      currentScope = new Scope(currentScope);
    };
    const popScope = () => {
      if (currentScope.parent) {
        currentScope = currentScope.parent;
      }
    };

    // Capture the instance of ContextAnalyzer so we can refer to tracker inside visitor functions.
    const self = this;

    // Visitor methods for AST traversal
    visit(ast, {
      // When entering a function declaration, create a new scope.
      visitFunctionDeclaration(path) {
        pushScope();
        this.traverse(path);
        popScope();
        return false;
      },
      // When entering a function expression, create a new scope.
      visitFunctionExpression(path) {
        pushScope();
        this.traverse(path);
        popScope();
        return false;
      },
      // When entering an arrow function expression, create a new scope.
      visitArrowFunctionExpression(path) {
        pushScope();
        this.traverse(path);
        popScope();
        return false;
      },
      // When entering a block, create a new scope.
      visitBlockStatement(path) {
        pushScope();
        this.traverse(path);
        popScope();
        return false;
      },
      // Record variable declarations.
      visitVariableDeclarator(path) {
        const node = path.node;
        if (n.Identifier.check(node.id)) {
          const varName = node.id.name;
          const uniqueId = self.tracker.addVariable(filePath, varName, node);
          currentScope.addDeclaration(varName, uniqueId);
        } else if (n.ObjectPattern.check(node.id)) {
          // Handle destructuring: e.g., const { a, b } = obj;
          node.id.properties.forEach((prop) => {
            if (n.Property.check(prop) && n.Identifier.check(prop.value)) {
              const varName = prop.value.name;
              const uniqueId = self.tracker.addVariable(filePath, varName, prop);
              currentScope.addDeclaration(varName, uniqueId);
              // Record the destructuring transformation.
              self.tracker.trackTransformation(uniqueId, filePath, prop, "destructuring", { original: "unknown" });
            }
          });
        }
        this.traverse(path);
      },
      // Record identifier usages.
      visitIdentifier(path) {
        const node = path.node;
        // Skip if the identifier is part of its own declaration.
        if (
          path.parentPath.node.type === "VariableDeclarator" &&
          path.parentPath.node.id === node
        ) {
          return false;
        }
        // Look up the variable in the current scope.
        const uniqueId = currentScope.lookup(node.name);
        if (uniqueId) {
          self.tracker.trackUsage(uniqueId, filePath, node, "reference");
        }
        this.traverse(path);
      },
      // Record export events for named exports.
      visitExportNamedDeclaration(path) {
        const node = path.node;
        if (node.declaration) {
          // Let the declaration be processed normally.
          this.traverse(path);
        } else if (node.specifiers) {
          node.specifiers.forEach((specifier) => {
            if (n.ExportSpecifier.check(specifier)) {
              const localName = Identifier.checkIdentifierName(specifier.local.name);
              const uniqueId = currentScope.lookup(localName);
              if (uniqueId) {
                const exportedName = Identifier.checkIdentifierName(specifier.exported.name);
                self.tracker.trackExport(uniqueId, filePath, node, "exportNamed", exportedName);
              }
            }
          });
        }
        return false;
      },
      // Record import events (proper tracking).
      visitImportDeclaration(path) {
        const node = path.node;
        node.specifiers.forEach((specifier) => {
          if (
            n.ImportSpecifier.check(specifier) ||
            n.ImportDefaultSpecifier.check(specifier) ||
            n.ImportNamespaceSpecifier.check(specifier)
          ) {
            const localName = Identifier.checkIdentifierName(specifier.local.name);
            const uniqueId = self.tracker.addVariable(filePath, localName, node);
            self.tracker.trackImport(uniqueId, filePath, node, "import", localName);
          }
        });
        return false;
      }
    } as Visitor);
  }

  /**
   * Analyze an entire project directory.
   * @param {string} projectDir - The project directory.
   */
  async analyzeProject(projectDir: string): Promise<void> {
    const pattern = path.join(projectDir, "**/*.{js,ts,jsx,tsx}");
    const files = await fastGlob(pattern);

    await Promise.all(
      files.map(async (file) => {
        console.log(`Analyzing ${file}...`);
        this.analyzeFile(file);
      })
    );

    const outputPath = path.join(projectDir, "dependencyGraph.json");
    await this.tracker.saveGraphToFile(outputPath);
    console.log(`Dependency graph saved to ${outputPath}`);
  }
}

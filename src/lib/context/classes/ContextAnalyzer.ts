import jscodeshift, { Collection } from "jscodeshift";
import { namedTypes as n } from "ast-types";
import fs from "fs/promises";
import nodePath from "node:path";

import { Scope } from "./Scope";
import { ContextTracker } from "./ContextTracker";

export class ContextAnalyzer {
  private tracker: ContextTracker;
  private moduleTypes: Map<string, "esm" | "cjs" | "unknown"> = new Map();

  constructor() {
    this.tracker = new ContextTracker();
  }

  async analyzeFile(filePath: string): Promise<{ localDeps: string[]; unusedImports: string[] }> {
    const code = await fs.readFile(filePath, "utf-8");
    const j = jscodeshift.withParser("babel-ts");
    const root: Collection = j(code);

    const esmFound = root.find(j.ImportDeclaration).size() > 0 || root.find(j.ExportDeclaration).size() > 0;
    const cjsFound = root.find(j.CallExpression, { callee: { name: "require" } }).size() > 0;
    const moduleType: "esm" | "cjs" | "unknown" = esmFound ? "esm" : cjsFound ? "cjs" : "unknown";
    this.moduleTypes.set(filePath, moduleType);

    let currentScope: Scope = new Scope();
    const localDeps: Set<string> = new Set();
    const importTracker: Map<string, string> = new Map();

    // Track Imports
    root.find(j.ImportDeclaration).forEach((p) => {
      const moduleName = p.node.source.value;
      if (typeof moduleName === "string") {
        const resolved = moduleName.startsWith(".") ? nodePath.resolve(nodePath.dirname(filePath), moduleName) : moduleName;
        if (moduleName.startsWith(".")) localDeps.add(resolved);

        const uniqueId = this.tracker.addVariable(filePath, moduleName, p.node);
        this.tracker.trackImport(uniqueId, filePath, p.node, moduleName.startsWith(".") ? "import" : "import-external", moduleName);
        importTracker.set(moduleName, uniqueId);
      }
    });

    // Track Re-Exports
    root.find(j.ExportAllDeclaration).forEach((p) => {
      const moduleName = p.node.source.value;
      if (typeof moduleName === "string") {
        const resolved = moduleName.startsWith(".") ? nodePath.resolve(nodePath.dirname(filePath), moduleName) : moduleName;
        const uniqueId = this.tracker.addVariable(filePath, moduleName, p.node);
        this.tracker.trackExport(uniqueId, filePath, p.node, moduleName.startsWith(".") ? "reExport" : "reExport-external", moduleName);
        if (moduleName.startsWith(".")) localDeps.add(resolved);
      }
    });

    // Track Variable Declarations
    root.find(j.VariableDeclarator).forEach((p) => {
      if (n.Identifier.check(p.node.id)) {
        const varName = p.node.id.name;
        const uniqueId = this.tracker.addVariable(filePath, varName, p.node);
        currentScope.addDeclaration(varName, uniqueId);
      } else if (n.ObjectPattern.check(p.node.id)) {
        p.node.id.properties.forEach((prop) => {
          if (n.Property.check(prop) && n.Identifier.check(prop.value)) {
            const varName = prop.value.name;
            const uniqueId = this.tracker.addVariable(filePath, varName, prop);
            currentScope.addDeclaration(varName, uniqueId);
            this.tracker.trackTransformation(uniqueId, filePath, prop, "destructuring", { original: "unknown" });
          }
        });
      }
    });

    // 🔥 **Fix: Track Variable Usages**
    root.find(j.Identifier).forEach((p) => {
      const varName = p.node.name;
      const scopeId = currentScope.lookup(varName);

      if (scopeId) {
        this.tracker.trackUsage(scopeId, filePath, p.node, "usage", { context: "expression" });
      }
    });

    // Detect Unused Imports
    const unusedImports: string[] = [];
    importTracker.forEach((uniqueId, modName) => {
      const context = this.tracker.queryVariable(uniqueId);
      if (context && context.usages.length === 0) {
        unusedImports.push(modName);
      }
    });

    return { localDeps: Array.from(localDeps), unusedImports };
  }

  async analyzeEntrypoints(entrypoints: string[]): Promise<void> {
    const visited: Set<string> = new Set();
    const self = this;

    async function analyzeFileRecursive(filePath: string): Promise<void> {
      const resolvedPath = nodePath.resolve(filePath);
      if (visited.has(resolvedPath)) return;
      visited.add(resolvedPath);

      console.log(`Analyzing ${resolvedPath}...`);
      const { localDeps } = await self.analyzeFile(resolvedPath);
      await Promise.all(localDeps.map(analyzeFileRecursive));
    }

    await Promise.all(entrypoints.map(analyzeFileRecursive));
    const outputPath = nodePath.join(process.cwd(), "dependencyGraph.json");
    await this.tracker.saveGraphToFile(outputPath);
    console.log(`Dependency graph saved to ${outputPath}`);
  }
}
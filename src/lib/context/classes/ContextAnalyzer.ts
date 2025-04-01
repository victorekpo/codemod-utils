import jscodeshift, { Collection } from "jscodeshift";
import { namedTypes as n } from "ast-types";
import fs from "fs/promises";
import nodePath from "node:path";
import { v4 as uuidv4 } from "uuid";

export class ContextAnalyzer {
  public contextMap: Map<string, any>;
  private j: jscodeshift.JSCodeshift;

  constructor() {
    this.j = jscodeshift.withParser("babel-ts");
    this.contextMap = new Map<string, any>();
  }

  async analyzeEntrypoints(entryPointPath: string, doLog = true, doSave = true): Promise<void> {
    // const analyzer = new ContextAnalyzer();
    const map = this.contextMap;
    await this.analyzeFile(entryPointPath, map);

    if (doLog) {
      this.logGraph();
    }

    if (doSave) {
      await this.saveGraphToFile("dependencyGraph.json");
      await this.saveGroupedGraphToFile("dependencyGraphGrouped.json");
    }
  }

  /**
   * Analyzes the file recursively and updates the context map.
   * @param filePath - The file to analyze.
   * @param contextMap - The map storing all variable contexts.
   */
  async analyzeFile(filePath: string, contextMap: Map<string, any>): Promise<void> {
    const code = await fs.readFile(filePath, "utf-8");
    const lines = code.split("\n"); // Store lines for quick access
    const root: Collection = this.j(code);

    // Track Imports
    root.find(this.j.ImportDeclaration).forEach((p) => {
      const moduleName = p.node.source.value;
      if (typeof moduleName === "string") {
        const resolvedPath = moduleName.startsWith(".")
          ? nodePath.resolve(nodePath.dirname(filePath), moduleName)
          : moduleName;

        // Extract the imported variable name instead of using moduleName
        const importedSpecifiers = p.node.specifiers?.map((specifier) => {
          if (n.ImportSpecifier.check(specifier)) {
            // Handle named imports with alias (e.g., import { myProfile as profile } from 'module')
            const importedVarName = specifier.local.name;
            const exportedVarName = specifier.imported?.name; // Name of the imported symbol

            if (exportedVarName && importedVarName) {
              // Aliased import
              return { local: importedVarName, exported: exportedVarName };
            } else {
              // Regular import
              return importedVarName;
            }
          } else if (n.ImportDefaultSpecifier.check(specifier)) {
            // Handle default imports (e.g., import myProfile from 'module')
            return specifier.local.name; // Default import has no 'imported' field
          }
          return null;
        }).filter(Boolean);

        // Track normal imports
        importedSpecifiers.forEach((importedVarName) => {
          if (typeof importedVarName === "string") {
            const uniqueId = this.addVariable(filePath, importedVarName, p.node, lines, contextMap);
            this.trackImport(uniqueId, filePath, p.node, "import", importedVarName, importedVarName, moduleName, resolvedPath, lines, contextMap);
          } else if (typeof importedVarName === "object") {
            // Handle aliased imports
            const { local, exported } = importedVarName;
            const uniqueId = this.addVariable(filePath, exported, p.node, lines, contextMap);
            this.trackImport(uniqueId, filePath, p.node, "import", exported, local, moduleName, resolvedPath, lines, contextMap);
          }
        });
      }
    });

    // Track Exports
    root.find(this.j.ExportNamedDeclaration).forEach((p) => {
      const declaration = p.node.declaration;
      let exportNames: string[] = [];
      let aliasedExports: { local: string; exported: string }[] = [];

      // Check if declaration is a VariableDeclaration or FunctionDeclaration
      if (n.VariableDeclaration.check(declaration) || n.FunctionDeclaration.check(declaration)) {
        // Handle VariableDeclaration
        if (n.VariableDeclaration.check(declaration)) {
          declaration.declarations.forEach((decl) => {
            if (n.VariableDeclarator.check(decl)) {
              if (n.Identifier.check(decl.id)) {
                // Simple variable declaration
                exportNames.push(decl.id.name);
              } else if (n.ObjectPattern.check(decl.id) || n.ArrayPattern.check(decl.id)) {
                // Handle destructuring assignment
                this.extractPatternNames(decl.id).forEach((name) => exportNames.push(name));
              }
            }
          });
        }

        // Handle FunctionDeclaration
        if (n.FunctionDeclaration.check(declaration) && declaration.id) {
          exportNames.push(declaration.id.name);
        }
      }

      // Handle named exports (export { myProfile }; and export { myProfile as profile };)
      if (p.node.specifiers) {
        p.node.specifiers.forEach((specifier) => {
          if (n.ExportSpecifier.check(specifier)) {
            const localName = specifier.local.name;
            const exportedName = specifier.exported.name;

            if (localName !== exportedName) {
              // Track alias separately
              aliasedExports.push({ local: localName, exported: exportedName });
            } else {
              // Normal named export
              exportNames.push(exportedName);
            }
          }
        });
      }

      // Track all regular named exports
      exportNames.forEach((exportName) => {
        const uniqueId = this.addVariable(filePath, exportName, p.node, lines, contextMap);
        this.trackExport(uniqueId, filePath, p.node, "exportNamed", exportName, filePath, lines, contextMap);
      });

      // Track aliased exports separately
      aliasedExports.forEach(({ local, exported }) => {
        const uniqueId = this.addVariable(filePath, exported, p.node, lines, contextMap);
        this.trackExport(uniqueId, filePath, p.node, "exportNamedAlias", `${local} as ${exported}`, filePath, lines, contextMap);
      });
    });


    root.find(this.j.ExportDefaultDeclaration).forEach((p) => {
      const uniqueId = this.addVariable(filePath, "default", p.node, lines, contextMap);
      this.trackExport(uniqueId, filePath, p.node, "exportDefault", "default", filePath, lines, contextMap);
    });

    // // Track Variable Declarations and Usages
    // root.find(this.j.VariableDeclarator).forEach((p) => {
    //   if (n.Identifier.check(p.node.id)) {
    //     const varName = p.node.id.name;
    //
    //     const contextMapArray = Array.from(contextMap.entries());
    //     const existingVar = contextMapArray.find(([_, context]) => context.exports.find(x => {
    //       return x.exportedAs === varName;
    //     }) && context.file === filePath);
    //
    //     if (!existingVar) {
    //       const uniqueId = this.addVariable(filePath, varName, p.node, lines, contextMap);
    //       this.trackUsage(uniqueId, filePath, p.node, "usage", { context: "declaration" }, lines, contextMap);
    //     }
    //   }
    // });

    // Track Variable Declarations and Usages
    root.find(this.j.VariableDeclarator).forEach((p) => {
      const { id, init } = p.node;

      // Handle simple variable declarations: const varName = ...
      if (n.Identifier.check(id)) {
        const varName = id.name;

        const contextMapArray = Array.from(contextMap.entries());
        const existingVar = contextMapArray.find(([_, context]) =>
          context.exports.some(x => x.exportedAs === varName) && context.file === filePath
        );

        if (!existingVar) {
          const uniqueId = this.addVariable(filePath, varName, p.node, lines, contextMap);
          this.trackUsage(uniqueId, filePath, p.node, "usage", { context: "declaration" }, lines, contextMap);
        }
      }

      // Handle object destructuring: const { myVar } = myObj;
      else if (n.ObjectPattern.check(id) && init && n.Identifier.check(init)) {
        const sourceVar = init.name;

        id.properties.forEach((prop: any) => {
          if (!n.Property.check(prop) || !n.Identifier.check(prop.key)) return;

          const extractedVar = prop.key.name;
          const uniqueId = this.addVariable(filePath, extractedVar, p.node, lines, contextMap);

          // Associate extracted variable with its source (e.g., profile → myProfile)
          const context = contextMap.get(uniqueId);
          if (context) {
            context.derivedFrom = sourceVar;
          }

          this.trackUsage(uniqueId, filePath, p.node, "usage", { context: "declaration" }, lines, contextMap);
        });
      }
    });


    // Track Variable Usages
    root.find(this.j.Identifier).forEach((p) => {
      const varName = p.node.name;

      const contextMapArray = Array.from(contextMap.entries());
      const existingVar = contextMapArray.find(([_, context]) => context.exports.find(x => {
        return x.exportedAs === varName;
      }) && context.file === filePath);

      if (!existingVar) {
        const uniqueId = this.lookupVariable(filePath, varName, contextMap);

        let node = p.node;
        if (uniqueId) {
          if (!p.node.loc) {
            node = p.parent.node;
            console.info("Node location not found, using parent node for reference");
          }
          this.trackUsage(uniqueId, filePath, node, "usage", { context: "expression" }, lines, contextMap);
        }
      }
    });


    // Recursively analyze imported files
    const localDeps: Set<string> = new Set();
    root.find(this.j.ImportDeclaration).forEach((p) => {
      const moduleName = p.node.source.value;
      if (typeof moduleName === "string" && moduleName.startsWith(".")) {
        const resolvedPath = nodePath.resolve(nodePath.dirname(filePath), moduleName);
        if (!contextMap.has(resolvedPath)) {
          localDeps.add(resolvedPath);
        }
      }
    });

    for (const dep of localDeps) {
      await this.analyzeFile(dep, contextMap);
    }
  }

  /**
   * Adds a new variable to the context map.
   * @param filePath - The file path.
   * @param varName - The variable name.
   * @param node - The AST node for the variable.
   * @param lines - Additional details about the usage.
   * @param contextMap - The map storing all variable contexts.
   * @returns A unique ID for the variable.
   */
  addVariable(filePath: string, varName: string, node: any, lines: string[], contextMap: Map<string, any>): string {
    const uniqueId = uuidv4();
    const lineText = lines[node.loc.start.line - 1].trim();

    if (!contextMap.has(uniqueId)) {
      contextMap.set(uniqueId, {
        file: filePath,
        varName,
        originalDefinition: lineText,
        position: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : null,
        usages: [],
        exports: [],
        imports: [],
        transformations: [],
      });
    }
    return uniqueId;
  }

  /**
   * Tracks an import event for a variable.
   * @param uniqueId - The unique ID of the variable.
   * @param file - The file where the import is used.
   * @param node - The AST node for the import.
   * @param importType - The type of the import (e.g., "import").
   * @param importName - The module being imported.
   * @param importAlias - The alias for the module being imported.
   * @param importedFrom - The original module string from the import statement.
   * @param importedFromFile - The original module file string from the import statement.
   * @param lines - Additional details about the usage.
   * @param contextMap - The map storing all variable contexts.
   */
  trackImport(uniqueId: string, file: string, node: any, importType: string, importName: string, importAlias: string, importedFrom: string, importedFromFile: string, lines: string[], contextMap: Map<string, any>): void {
    const context = contextMap.get(uniqueId);
    const lineText = lines[node.loc.start.line - 1].trim();

    if (context) {
      context.imports.push({
        code: importName,
        fullLine: lineText,
        file,
        position: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : null,
        importType,
        importName,
        ...(importAlias !== importName ? { importAlias } : {}),
        importedFrom,
        importedFromFile
      });
    }
  }

  /**
   * Tracks a usage event for a variable.
   * @param uniqueId - The unique ID of the variable.
   * @param file - The file where the usage happens.
   * @param node - The AST node for the usage.
   * @param type - The type of the usage (e.g., "usage").
   * @param details - Additional details about the usage.
   * @param lines - Additional details about the usage.
   * @param contextMap - The map storing all variable contexts.
   */
  trackUsage(
    uniqueId: string,
    file: string,
    node: any,
    type: string,
    details: Record<string, any>,
    lines: string[],
    contextMap: Map<string, any>
  ): void {
    if (!contextMap.has(uniqueId)) return;

    const context = contextMap.get(uniqueId);

    if (!node.loc) {
      console.error("Node location not found", node);
    }
    const lineText = lines[node.loc.start.line - 1].trim();

    // Skip if fullLine is the same as originalDefinition
    if (context.originalDefinition === lineText) {
      // console.log(`[DEBUG] Skipping duplicate usage: ${lineText} in ${file}`);
      return;
    }

    // Skip duplicate usages
    if (context.usages.find(({ fullLine }) => fullLine === lineText)) {
      // console.log(`[DEBUG] Skipping duplicate usage found in map: ${lineText} in ${file}`);
      return;
    }

    context.usages.push({
      code: node.name,
      fullLine: lineText,
      file,
      position: { line: node.loc.start.line, column: node.loc.start.column },
      type,
      details,
    });
  }


  /**
   * Tracks an export event for a variable.
   * @param uniqueId - The unique ID of the variable.
   * @param file - The file where the export is defined.
   * @param node - The AST node for the export.
   * @param exportType - The type of the export (e.g., "exportNamed").
   * @param exportedAs - The exported name.
   * @param exportedFromFile - The original module file string from the export statement.
   * @param lines - Additional details about the usage.
   * @param contextMap - The map storing all variable contexts.
   */
  trackExport(
    uniqueId: string,
    file: string,
    node: any,
    exportType: string,
    exportedAs: string,
    exportedFromFile: string,
    lines: string[],
    contextMap: Map<string, any>
  ): void {
    const context = contextMap.get(uniqueId);
    if (!context) return;

    const lineText = lines[node.loc.start.line - 1].trim();
    context.exports.push({
      code: lineText,
      file,
      position: node.loc ? { line: node.loc.start.line, column: node.loc.start.column } : null,
      exportType,
      exportedAs,
      exportedFromFile,
    });

    // Now, check the contextMap for any imports that use this file
    for (const [importId, importContext] of contextMap) {
      // Skip the current file's import context
      if (importId === uniqueId) continue;

      importContext.imports.forEach((imp) => {
        // Check if the import references the current file (exporting file)
        if (imp.importedFromFile !== exportedFromFile || imp.importName !== exportedAs) return;

        context.usages.push({
          code: imp.code,
          fullLine: imp.fullLine,
          file: imp.file,
          position: imp.position,
          type: "usage",
          details: { context: "expression" },
        });

        // Add other usages from the found context
        for (const usage of importContext.usages) {
          if (usage.file === file) continue;

          const usageItem = {
            code: usage.code,
            fullLine: usage.fullLine,
            file: usage.file,
            position: usage.position,
            type: usage.type,
            details: usage.details,
          };

          // Check if the usage code is the final statement and doesn't reference more variables
          // console.log("Usage Full Line", usage.fullLine);

          // Add nested usages for this initial usage
          this.addNestedUsages(usageItem, contextMap);

          context.usages.push(usageItem);
        }
      });
    }
  }

  /**
   * Extracts variables from a code string using jscodeshift.
   * @param code - The JavaScript/TypeScript code as a string.
   * @returns An array of unique variable names.
   */
  extractVariablesFromCode(code: string): string[] {
    const root = jscodeshift(code); // Parse the code into an AST
    const variables = new Set<string>(); // Use a Set to avoid duplicates

    // Find all VariableDeclarators (e.g., const foo = ...)
    root.find(jscodeshift.VariableDeclarator).forEach((path: any) => {
      variables.add(path.node.id.name); // Add variable name to the Set
    });

    return variables.size ? Array.from(variables) : [];
  }

  /**
   * Recursively adds nested usages for a given usage item.
   * @param usageItem - The usage item for which nested usages should be tracked.
   * @param contextMap - The map storing all variable contexts.
   */
  addNestedUsages(usageItem: any, contextMap: Map<string, any>): void {
    // Use jscodeshift to extract variables from the usage code
    const nestedVariables = this.extractVariablesFromCode(usageItem.fullLine);
    if (!nestedVariables.length) return;

    console.log(`Nested variables found: ${nestedVariables.join(",")}`);

    // Initialize nestedUsages array only if there are nested variables
    usageItem.nestedUsages = nestedVariables
      .map((varName) => {
        const uniqueId = this.lookupVariable(usageItem.file, varName, contextMap);
        const foundContext = contextMap.get(uniqueId);
        if (!foundContext) return null;

        // Create a new nested usage entry for this variable
        return foundContext.usages.map((usage) => ({
          code: usage.code,
          fullLine: usage.fullLine,
          file: usage.file,
          position: usage.position,
          type: usage.type,
          details: usage.details,
        }));
      })
      .flat()
      .filter(Boolean); // Remove null/undefined entries

    // Recursively add nested usages for this nested variable
    usageItem.nestedUsages.forEach((nestedUsage: any) => this.addNestedUsages(nestedUsage, contextMap));

    // Remove empty nestedUsages array to keep output clean
    if (!usageItem.nestedUsages.length) delete usageItem.nestedUsages;
  }

  /**
   * Looks up a variable by its name in the context map.
   * @param filePath - The filePath of the variable.
   * @param varName - The name of the variable.
   * @param contextMap - The map storing all variable contexts.
   * @returns The unique ID of the variable or undefined if not found.
   */
  lookupVariable(filePath, varName: string, contextMap: Map<string, any>): string | undefined {
    for (const [uniqueId, context] of contextMap) {
      if (context.varName === varName && context.file === filePath) {
        return uniqueId;
      }
    }
    return undefined;
  }

  /**
   * Groups the flat context map into a file-keyed structure.
   * Each file will have keys: variables, imports, exports.
   */
  groupGraphByFile(): Record<string, any> {
    const result: Record<string, any> = {};
    const graph = this.convertGraphToObject();

    for (const key in graph) {
      const entry = graph[key];
      const file = entry.file;
      const hasImports = entry.imports && entry.imports.length;
      const hasExports = entry.exports && entry.exports.length;


      if (!result[file]) {
        result[file] = { variables: {}, imports: {}, exports: {} };
      }

      const { imports, exports, ...rest } = entry;

      let newEntry;
      if (hasImports) {
        // delete unneeded keys
        delete entry.imports[0].file;
        delete entry.imports[0].code;
        delete entry.imports[0].fullLine;
        delete entry.imports[0].position;

        // flatten imports since we can rightfully only have one import per variable in a single file
        newEntry = {
          ...rest,
          ...imports[0]
        }

        result[file].imports[entry.varName] = newEntry;
      }

      if (hasExports) {
        // delete unneeded keys
        delete entry.exports[0].file;
        delete entry.exports[0].code;
        delete entry.exports[0].position;

        // flatten exports since we can rightfully only have one export per variable in a single file
        newEntry = {
          ...rest,
          ...exports[0]
        }

        result[file].exports[entry.varName] = newEntry;
      }

      if (!hasImports && !hasExports) {
        newEntry = {
          ...rest
        }

        result[file].variables[entry.varName] = newEntry;
      }
      // end loop
    }

    return result;
  }

  getGraph(): any {
    return this.contextMap;
  }

  convertGraphToObject(): any {
    return Object.fromEntries(this.contextMap);
  }

  convertGraphToString(): string {
    const graph = this.convertGraphToObject();
    return JSON.stringify(graph, null, 2);
  }

  convertGraphToGroupedGraph(): any {
    return this.groupGraphByFile();
  }

  convertGraphToGroupedGraphString(): any {
    const graph = this.convertGraphToGroupedGraph();
    return JSON.stringify(graph, null, 2);
  }

  logGraph(): void {
    const graph = this.convertGraphToString();
    console.log("Context Graph", graph);
  }

  /**
   * Save the dependency graph to a JSON file.
   */
  async saveGraphToFile(filePath: string): Promise<void> {
    await fs.writeFile(filePath, this.convertGraphToString(), "utf-8");
    console.log("Saved context graph to:", filePath);
  }

  async saveGroupedGraphToFile(filePath: string): Promise<void> {
    await fs.writeFile(filePath, this.convertGraphToGroupedGraphString(), "utf-8");
    console.log("Saved context graph to:", filePath);
  }

  /**
   * Load the dependency graph from a JSON file.
   */
  async loadGraphFromFile(filePath: string): Promise<void> {
    const data = await fs.readFile(filePath, "utf-8");
    this.contextMap = JSON.parse(data);
    console.log("Loaded context graph:", this.contextMap);
  }

  extractPatternNames(pattern: n.ObjectPattern | n.ArrayPattern): string[] {
    const names: string[] = [];

    if (n.ObjectPattern.check(pattern)) {
      pattern.properties.forEach((prop) => {
        if (n.Property.check(prop) && n.Identifier.check(prop.key)) {
          names.push(prop.key.name);
        } else if (n.RestElement.check(prop) && n.Identifier.check(prop.argument)) {
          names.push(prop.argument.name);
        }
      });
    } else if (n.ArrayPattern.check(pattern)) {
      pattern.elements.forEach((element) => {
        if (element && n.Identifier.check(element)) {
          names.push(element.name);
        }
      });
    }

    return names;
  }

  private isTopLevelStatement(node: any): boolean {
    return [
      "VariableDeclaration", "ExpressionStatement", "ReturnStatement",
      "IfStatement", "WhileStatement", "ForStatement"
    ].includes(node.type);
  }

  private extractFullStatement(node: any): string {
    let current = node;

    // If node is inside a VariableDeclarator, keep going up to find the full VariableDeclaration
    while (current && current.parent) {
      if (current.parent.type === "VariableDeclarator") {
        current = current.parent; // Move up to the VariableDeclarator
      }
      if (current.parent.type === "VariableDeclaration") {
        return this.j(current.parent).toSource(); // Return full declaration: const/let/var
      }

      // Exit if we hit a top-level statement (e.g., a function or class body)
      if (this.isTopLevelStatement(current.parent)) {
        break;
      }

      // Otherwise, keep moving up the tree
      current = current.parent;
    }

    return this.j(current).toSource(); // Fallback if no declaration found
  }


  private isVariableDeclaration(node: any): boolean {
    return node.type === "VariableDeclaration";
  }
}
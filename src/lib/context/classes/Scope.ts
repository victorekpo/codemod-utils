// A helper class for tracking variable declarations in a scope

export class Scope {
  readonly parent: Scope | null;
  private declarations: Map<string, string>;

  constructor(parent: Scope | null = null) {
    this.parent = parent;
    // Map from variable name to its unique ID (from ContextTracker)
    this.declarations = new Map();
  }

  /**
   * Add a variable declaration to the current scope.
   */
  addDeclaration(varName: string, uniqueId: string): void {
    this.declarations.set(varName, uniqueId);
  }

  /**
   * Lookup a variable's unique ID in the current scope or any parent scope.
   */
  lookup(varName: string): string | null {
    if (this.declarations.has(varName)) {
      return this.declarations.get(varName) ?? null;
    }
    return this.parent ? this.parent.lookup(varName) : null;
  }
}

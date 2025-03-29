import { namedTypes as N } from "ast-types";
import { Statement } from "./base/Statement";
import { DeclarationKind, ExportSpecifierKind, ImportAttributeKind, LiteralKind } from "ast-types/gen/kinds";

export class ExportNamedDeclaration extends Statement<N.ExportNamedDeclaration> {
  declaration: DeclarationKind | null;
  specifiers?: ExportSpecifierKind[];
  source?: LiteralKind | null;
  assertions?: ImportAttributeKind[];

  constructor(props: Omit<N.ExportNamedDeclaration, "type">) {
    super({ type: "ExportNamedDeclaration", ...props });
    this.declaration = props.declaration;
    this.specifiers = props.specifiers;
    this.source = props.source || null;
    this.assertions = props.assertions;
  }

  getDeclaration() {
    return this.declaration;
  }

  getSpecifiers() {
    return this.specifiers;
  }

  getSource() {
    return this.source;
  }

  getAssertions() {
    return this.assertions;
  }

  hasDefaultExport() {
    return this.specifiers?.some(spec => spec.exported.name === "default");
  }
}
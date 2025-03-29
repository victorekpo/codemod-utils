import { namedTypes as N } from "ast-types";
import { Statement } from "./base/Statement";
import {
  ImportAttributeKind,
  ImportDefaultSpecifierKind,
  ImportNamespaceSpecifierKind,
  ImportSpecifierKind,
  LiteralKind
} from "ast-types/gen/kinds";

export class ImportDeclaration extends Statement<N.ImportDeclaration> {
  specifiers?: (ImportSpecifierKind | ImportNamespaceSpecifierKind | ImportDefaultSpecifierKind)[];
  source: LiteralKind;
  importKind?: "value" | "type" | "typeof";
  assertions?: ImportAttributeKind[];

  constructor(props: Omit<N.ImportDeclaration, "type">) {
    super({ type: "ImportDeclaration", ...props });
    this.specifiers = props.specifiers;
    this.source = props.source;
    this.importKind = props.importKind;
    this.assertions = props.assertions;
  }

  getSpecifiers() {
    return this.specifiers;
  }

  getSource() {
    return this.source;
  }

  getImportKind() {
    return this.importKind;
  }

  getAssertions() {
    return this.assertions;
  }

  getNamedImports() {
    return this.specifiers?.filter(spec => spec.type === "ImportSpecifier");
  }
}
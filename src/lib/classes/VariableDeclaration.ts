import { namedTypes as N } from "ast-types";
import { Statement } from "./base/Statement";
import { IdentifierKind, VariableDeclaratorKind } from "ast-types/gen/kinds";

export class VariableDeclaration extends Statement<N.VariableDeclaration> {
  kind: "var" | "let" | "const";
  declarations: (VariableDeclaratorKind | IdentifierKind)[];

  constructor(props: N.VariableDeclaration) {
    super({ type: "VariableDeclaration", ...props });
    this.kind = props.kind;
    this.declarations = props.declarations;
  }

  getKind() {
    return this.kind;
  }

  getDeclarations() {
    return this.declarations;
  }
}
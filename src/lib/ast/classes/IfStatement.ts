import { namedTypes as N } from "ast-types";
import { Statement } from "./base/Statement";
import { ExpressionKind, StatementKind } from "ast-types/gen/kinds";

export class IfStatement extends Statement<N.IfStatement> {
  test: ExpressionKind;
  consequent: StatementKind;
  alternate?: StatementKind | null;

  constructor(props: Omit<N.IfStatement, "type">) {
    super({ type: "IfStatement", ...props });
    this.test = props.test;
    this.consequent = props.consequent;
    this.alternate = props.alternate || null;
  }

  getTest() {
    return this.test;
  }

  getConsequent() {
    return this.consequent;
  }

  getAlternate() {
    return this.alternate;
  }
}
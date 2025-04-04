import { namedTypes as N } from "ast-types";
import { Node } from "./base/Node";
import { ExpressionKind, PatternKind } from "ast-types/gen/kinds";

export class VariableDeclarator extends Node<N.VariableDeclarator> {
  id: PatternKind;
  init?: ExpressionKind | null;

  constructor(props: Omit<N.VariableDeclarator, "type">) {
    super({ type: "VariableDeclarator", ...props });
    this.id = props.id;
    this.init = props.init || null;
  }

  getId() {
    return this.id;
  }

  getInit() {
    return this.init;
  }
}
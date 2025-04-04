import { namedTypes as N } from "ast-types";
import { Node } from "./base/Node";
import { DecoratorKind, ExpressionKind, FunctionKind } from "ast-types/gen/kinds";

export class ClassMethodDefinition extends Node<N.MethodDefinition> {
  kind: "constructor" | "method" | "get" | "set";
  key: ExpressionKind;
  value: FunctionKind;
  computed?: boolean;
  static?: boolean;
  decorators?: DecoratorKind[] | null;

  constructor(props: N.MethodDefinition) {
    super({ type: "MethodDefinition", ...props });
    this.kind = props.kind;
    this.key = props.key;
    this.value = props.value;
    this.computed = props.computed;
    this.static = props.static;
    this.decorators = props.decorators || null;
  }

  getKind() {
    return this.kind;
  }

  getKey() {
    return this.key;
  }

  getFunction() {
    return this.value;
  }

  isStatic() {
    return this.static;
  }
}
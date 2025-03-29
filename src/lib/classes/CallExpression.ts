import { namedTypes as N } from "ast-types";
import { Node } from "./base/Node";
import { Expression } from "./base/Expression";
import { ChainElement } from "./base/ChainElement";
import { ExpressionKind, SpreadElementKind, TypeParameterInstantiationKind } from "ast-types/gen/kinds";

export class CallExpression extends Node<N.CallExpression> implements Expression<N.CallExpression>, ChainElement<N.CallExpression> {
  callee: ExpressionKind;
  arguments: (ExpressionKind | SpreadElementKind)[];
  typeArguments?: null | TypeParameterInstantiationKind;
  optional?: boolean;

  constructor(props: N.CallExpression) {
    super({ type: "CallExpression", ...props });
    this.callee = props.callee;
    this.arguments = props.arguments;
    this.typeArguments = props.typeArguments || null;
    this.optional = props.optional;
  }

  getCallee() {
    return this.callee;
  }

  getArguments() {
    return this.arguments;
  }
}
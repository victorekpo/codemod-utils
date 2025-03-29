import { Node } from "./Node";
import { namedTypes as N } from "ast-types/gen/namedTypes";
import {
  BlockStatementKind,
  ExpressionKind,
  FlowPredicateKind,
  IdentifierKind,
  PatternKind,
  TSTypeAnnotationKind,
  TSTypeParameterDeclarationKind,
  TypeAnnotationKind,
  TypeParameterDeclarationKind
} from "ast-types/gen/kinds";

export class FunctionClass<T> extends Node<N.Function> {
  id?: IdentifierKind | null;
  params: PatternKind[];
  body: BlockStatementKind | ExpressionKind;
  generator?: boolean;
  async?: boolean;
  expression?: boolean;
  defaults?: (ExpressionKind | null)[];
  rest?: IdentifierKind | null;
  returnType?: TypeAnnotationKind | TSTypeAnnotationKind | null;
  typeParameters?: TypeParameterDeclarationKind | TSTypeParameterDeclarationKind | null;
  predicate?: FlowPredicateKind | null;

  constructor(props: N.Function | N.ArrowFunctionExpression) {
    super(props);
    this.id = props.id;
    this.params = props.params;
    this.body = props.body;
    this.generator = props.generator;
    this.async = props.async;
    this.expression = props.expression;
    this.defaults = props.defaults;
    this.rest = props.rest;
    this.returnType = props.returnType;
    this.typeParameters = props.typeParameters;
    this.predicate = props.predicate;
  }

  getFunctionName() {
    return this.id ? this.id.name : "";
  }

  getParams() {
    return this.params;
  }

  getBody() {
    return this.body;
  }

  isAsync() {
    return this.async;
  }
}
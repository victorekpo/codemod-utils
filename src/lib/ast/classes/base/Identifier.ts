import { namedTypes as N } from "ast-types";
import { Node } from "./Node";
import { Expression } from "./Expression";
import { Pattern } from "./Pattern";
import { IdentifierKind, TSTypeAnnotationKind, TypeAnnotationKind } from "ast-types/gen/kinds";

export class Identifier extends Node<N.Identifier> implements Expression<N.Identifier>, Pattern<N.Identifier> {
  name: string;
  optional?: boolean;
  typeAnnotation?: TypeAnnotationKind | TSTypeAnnotationKind | null;

  constructor(props: Omit<N.Identifier, "type">) {
    super({ type: "Identifier", ...props });
    this.name = props.name;
    this.optional = props.optional;
    this.typeAnnotation = props.typeAnnotation || null;
  }

  getName() {
    return this.name;
  }

  isOptional() {
    return this.optional;
  }

  getTypeAnnotation() {
    return this.typeAnnotation;
  }

  // Helper function to extract the string value from IdentifierKind
  static getIdentifierName(identifier: string | IdentifierKind): string {
    if (typeof identifier === "string") {
      return identifier;
    } else if (identifier && "name" in identifier) {
      return identifier.name as string;
    }
    throw new Error("Invalid IdentifierKind");
  }

  static checkIdentifierName(identifier: string | IdentifierKind): string {
    if (N.Identifier.check(identifier)) {
      return identifier.name;
    } else if (typeof identifier === "object" && "name" in identifier) {
      return identifier.name as string;
    } else {
      return identifier;
    }
  }
}
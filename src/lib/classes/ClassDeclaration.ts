import { namedTypes as N } from "ast-types";
import { Statement } from "./base/Statement";
import { ChainElement } from "./base/ChainElement";
import {
  ClassBodyKind,
  ClassImplementsKind,
  ExpressionKind,
  IdentifierKind,
  TSExpressionWithTypeArgumentsKind,
  TSTypeParameterDeclarationKind,
  TSTypeParameterInstantiationKind,
  TypeParameterDeclarationKind,
  TypeParameterInstantiationKind
} from "ast-types/gen/kinds";

export class ClassDeclaration extends Statement<N.ClassDeclaration> implements ChainElement<N.ClassDeclaration> {
  id: IdentifierKind | null;
  body: ClassBodyKind;
  superClass?: ExpressionKind | null;
  typeParameters?: TypeParameterDeclarationKind | TSTypeParameterDeclarationKind | null;
  superTypeParameters?: TypeParameterInstantiationKind | TSTypeParameterInstantiationKind | null;
  implements?: ClassImplementsKind[] | TSExpressionWithTypeArgumentsKind[];

  constructor(props: N.ClassDeclaration) {
    super({ type: "ClassDeclaration", ...props });
    this.id = props.id;
    this.body = props.body;
    this.superClass = props.superClass || null;
    this.typeParameters = props.typeParameters || null;
    this.superTypeParameters = props.superTypeParameters || null;
    this.implements = props.implements || [];
  }

  getClassName() {
    return this.id?.name || null;
  }

  getSuperClass() {
    return this.superClass;
  }

  getBody() {
    return this.body;
  }

  getMethods() {
    return this.body.body.filter(member => member.type === "MethodDefinition");
  }
}
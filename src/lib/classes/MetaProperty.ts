import { namedTypes as N } from "ast-types";
import { Expression } from "./base/Expression";
import { IdentifierKind } from "ast-types/gen/kinds";

export class MetaProperty extends Expression<N.MetaProperty> {
  meta: IdentifierKind;
  property: IdentifierKind;

  constructor(props: Omit<N.MetaProperty, "type">) {
    super({ type: "MetaProperty", ...props });
    this.meta = props.meta;
    this.property = props.property;
  }

  getMeta() {
    return this.meta;
  }

  getProperty() {
    return this.property;
  }
}
import { namedTypes as N } from "ast-types";
import { Expression } from "./base/Expression";
import { ExpressionKind, TemplateLiteralKind } from "ast-types/gen/kinds";

export class TaggedTemplateExpression extends Expression<N.TaggedTemplateExpression> {
  tag: ExpressionKind;
  quasi: TemplateLiteralKind;

  constructor(props: Omit<N.TaggedTemplateExpression, "type">) {
    super({ type: "TaggedTemplateExpression", ...props });
    this.tag = props.tag;
    this.quasi = props.quasi;
  }

  getTag() {
    return this.tag;
  }

  getTemplate() {
    return this.quasi;
  }
}
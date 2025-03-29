import { namedTypes as N } from "ast-types";
import { Expression } from "./base/Expression";
import { ExpressionKind, TemplateElementKind, TSTypeKind } from "ast-types/gen/kinds";

export class TemplateLiteral extends Expression<N.TemplateLiteral> {
  // In the context of a TemplateLiteral in JavaScript and TypeScript,
  // quasis refers to the static parts of the template literal string.
  // These are the portions of the string that do not change and are separated by expressions.
  // For example, in the template literal
  // `Hello, ${name}!`, the quasis would be the static strings "Hello, " and "!"
  // while the expressions would be the dynamic part ${name}.
  quasis: TemplateElementKind[];
  expressions: (ExpressionKind | TSTypeKind)[];

  constructor(props: Omit<N.TemplateLiteral, "type">) {
    super({ type: "TemplateLiteral", ...props });
    this.quasis = props.quasis;
    this.expressions = props.expressions;
  }

  getQuasis() {
    return this.quasis;
  }

  getExpressions() {
    return this.expressions;
  }

  getStringValues() {
    return this.quasis.map(q => q.value.raw);
  }
}
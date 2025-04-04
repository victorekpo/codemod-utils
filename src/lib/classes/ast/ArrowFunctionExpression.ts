import { namedTypes as N } from "ast-types";
import { FunctionClass } from "./base/Function";

export class ArrowFunctionExpression extends FunctionClass<N.ArrowFunctionExpression> {
  constructor(props: N.ArrowFunctionExpression) {
    super({ type: "ArrowFunctionExpression", ...props });
    this.id = null;
    this.generator = false;
  }

  isSingleExpressionBody() {
    return this.body.type !== "BlockStatement";
  }

  isBlockStatementBody() {
    return this.body.type === "BlockStatement";
  }
}
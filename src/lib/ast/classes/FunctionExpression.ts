import { namedTypes as N } from "ast-types";
import { FunctionClass } from "./base/Function";

export class FunctionExpression extends FunctionClass<N.FunctionExpression> {
  constructor(props: Omit<N.FunctionExpression, "type">) {
    super({ type: "FunctionExpression", ...props });
  }
}
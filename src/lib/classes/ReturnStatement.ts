import { namedTypes as N } from "ast-types";
import { Statement } from "./base/Statement";
import { ExpressionKind } from "ast-types/gen/kinds";

export class ReturnStatement extends Statement<N.ReturnStatement> {
  argument: ExpressionKind | null;

  constructor(props: Omit<N.ReturnStatement, "type">) {
    super({ type: "ReturnStatement", ...props });
    this.argument = props.argument;
  }

  getArgument() {
    return this.argument;
  }
}
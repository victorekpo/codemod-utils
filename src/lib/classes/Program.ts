import { namedTypes as N } from "ast-types";
import { Node } from "./base/Node";
import { DirectiveKind, InterpreterDirectiveKind, StatementKind } from "ast-types/gen/kinds";

export class Program extends Node<N.Program> {
  body: StatementKind[];
  directives?: DirectiveKind[];
  interpreter?: InterpreterDirectiveKind | null;

  constructor(props: Omit<N.Program, "type">) {
    super({ type: "Program", ...props });
    this.body = props.body;
    this.directives = props.directives;
    this.interpreter = props.interpreter || null;
  }

  getBody() {
    return this.body;
  }

  getDirectives() {
    return this.directives;
  }

  getInterpreter() {
    return this.interpreter;
  }
}
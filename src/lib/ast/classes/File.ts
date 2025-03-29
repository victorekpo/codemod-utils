import { namedTypes as N } from "ast-types";
import { Node } from "./base/Node";
import { ProgramKind } from "ast-types/gen/kinds";

export class File extends Node<N.File> {
  program: ProgramKind;
  name?: string | null;

  constructor(props: Omit<N.File, "type">) {
    super({ type: "File", ...props });
    this.program = props.program;
    this.name = props.name || null;
  }

  getProgram() {
    return this.program;
  }

  getName() {
    return this.name;
  }
}
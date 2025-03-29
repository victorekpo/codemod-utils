import { namedTypes as N } from "ast-types";
import { FunctionClass } from "./base/Function";

export class FunctionDeclaration extends FunctionClass<N.FunctionDeclaration> {
  constructor(props: Omit<N.FunctionDeclaration, "type">) {
    super({ type: "FunctionDeclaration", ...props });
  }
}
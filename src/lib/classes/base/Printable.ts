import { SourceLocationKind } from "ast-types/gen/kinds";
import { namedTypes } from "ast-types";

export class Printable {
  loc?: SourceLocationKind | null;

  constructor(loc?: namedTypes.SourceLocation) {
    this.loc = loc;
  }
}
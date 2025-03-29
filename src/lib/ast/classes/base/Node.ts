import { namedTypes as N } from "ast-types";
import { CommentKind } from "ast-types/gen/kinds";
import { Printable } from "./Printable";

export class Node<T extends N.Node> extends Printable {
  type?: string;
  comments?: CommentKind[] | null;

  constructor(props: N.Node) {
    super(props.loc);
    this.type = props.type;
    this.comments = props.comments;
  }

  getType(): string {
    return this.type;
  }

  getComments(): string {
    return this.comments ? this.comments.map(comment => comment.value).join("\n") : "";
  }
}
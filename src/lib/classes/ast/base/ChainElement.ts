import { Node } from './Node';
import { namedTypes as N } from "ast-types";

export class ChainElement<T extends N.Node> extends Node<T> {
  optional?: boolean;

  constructor(props: N.ChainElement) {
    super(props);
    this.optional = props.optional;
  }
}
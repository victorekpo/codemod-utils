import { Node } from './Node';
import { namedTypes as N } from "ast-types";

export class Expression<T extends N.Expression> extends Node<T> {
  constructor(props: N.Expression) {
    super(props);
  }
}
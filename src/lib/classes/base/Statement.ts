import { Node } from './Node';
import { namedTypes as N } from "ast-types";

export class Statement<T extends N.Statement> extends Node<T> {
  constructor(props: N.Statement) {
    super(props);
  }
}
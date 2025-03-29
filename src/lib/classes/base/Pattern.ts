import { Node } from './Node';
import { namedTypes as N } from "ast-types";

export class Pattern<T extends N.Pattern> extends Node<T> {
  constructor(props: N.Pattern) {
    super(props);
  }
}
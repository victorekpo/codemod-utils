// import base classes
import { ChainElement } from "./lib/classes/ast/base/ChainElement";
import { Expression } from "./lib/classes/ast/base/Expression";
import { FunctionClass } from "./lib/classes/ast/base/Function";
import { Identifier } from "./lib/classes/ast/base/Identifier";
import { Node } from "./lib/classes/ast/base/Node";
import { Pattern } from "./lib/classes/ast/base/Pattern";
import { Printable } from "./lib/classes/ast/base/Printable";
import { Statement } from "./lib/classes/ast/base/Statement";

// import classes
import { ArrowFunctionExpression } from './lib/classes/ast/ArrowFunctionExpression';
import { CallExpression } from './lib/classes/ast/CallExpression';
import { ClassDeclaration } from './lib/classes/ast/ClassDeclaration';
import { ClassMethodDefinition } from './lib/classes/ast/ClassMethodDefinition';
import { ExportNamedDeclaration } from './lib/classes/ast/ExportNamedDeclaration';
import { File } from './lib/classes/ast/File';
import { FunctionDeclaration } from './lib/classes/ast/FunctionDeclaration';
import { FunctionExpression } from './lib/classes/ast/FunctionExpression';
import { IfStatement } from './lib/classes/ast/IfStatement';
import { ImportDeclaration } from './lib/classes/ast/ImportDeclaration';
import { MetaProperty } from './lib/classes/ast/MetaProperty';
import { Program } from './lib/classes/ast/Program';
import { ReturnStatement } from './lib/classes/ast/ReturnStatement';
import { TaggedTemplateExpression } from './lib/classes/ast/TaggedTemplateExpression';
import { TemplateLiteral } from './lib/classes/ast/TemplateLiteral';
import { VariableDeclaration } from './lib/classes/ast/VariableDeclaration';
import { VariableDeclarator } from './lib/classes/ast/VariableDeclarator';

// import context
import { ContextAnalyzer } from "./lib/classes/context/ContextAnalyzer";

export {
  // base classes
  ChainElement,
  Expression,
  FunctionClass,
  Identifier,
  Node,
  Pattern,
  Printable,
  Statement,
  // classes
  ArrowFunctionExpression,
  CallExpression,
  ClassDeclaration,
  ClassMethodDefinition,
  ExportNamedDeclaration,
  File,
  FunctionDeclaration,
  FunctionExpression,
  IfStatement,
  ImportDeclaration,
  MetaProperty,
  Program,
  ReturnStatement,
  TaggedTemplateExpression,
  TemplateLiteral,
  VariableDeclaration,
  VariableDeclarator,
  //context
  ContextAnalyzer
}
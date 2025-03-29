// import base classes
import { ChainElement } from "./lib/ast/classes/base/ChainElement";
import { Expression } from "./lib/ast/classes/base/Expression";
import { FunctionClass } from "./lib/ast/classes/base/Function";
import { Identifier } from "./lib/ast/classes/base/Identifier";
import { Node } from "./lib/ast/classes/base/Node";
import { Pattern } from "./lib/ast/classes/base/Pattern";
import { Printable } from "./lib/ast/classes/base/Printable";
import { Statement } from "./lib/ast/classes/base/Statement";

// import classes
import { ArrowFunctionExpression } from './lib/ast/classes/ArrowFunctionExpression';
import { CallExpression } from './lib/ast/classes/CallExpression';
import { ClassDeclaration } from './lib/ast/classes/ClassDeclaration';
import { ClassMethodDefinition } from './lib/ast/classes/ClassMethodDefinition';
import { ExportNamedDeclaration } from './lib/ast/classes/ExportNamedDeclaration';
import { File } from './lib/ast/classes/File';
import { FunctionDeclaration } from './lib/ast/classes/FunctionDeclaration';
import { FunctionExpression } from './lib/ast/classes/FunctionExpression';
import { IfStatement } from './lib/ast/classes/IfStatement';
import { ImportDeclaration } from './lib/ast/classes/ImportDeclaration';
import { MetaProperty } from './lib/ast/classes/MetaProperty';
import { Program } from './lib/ast/classes/Program';
import { ReturnStatement } from './lib/ast/classes/ReturnStatement';
import { TaggedTemplateExpression } from './lib/ast/classes/TaggedTemplateExpression';
import { TemplateLiteral } from './lib/ast/classes/TemplateLiteral';
import { VariableDeclaration } from './lib/ast/classes/VariableDeclaration';
import { VariableDeclarator } from './lib/ast/classes/VariableDeclarator';

// import context
import { ContextAnalyzer } from "./lib/context/classes/ContextAnalyzer";

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
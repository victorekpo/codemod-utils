```typescript
// Example usage
const functionExpression = new FunctionExpression({
  loc: {
    start: { line: 1, column: 0 },
    end: { line: 1, column: 1 }
  },
  comments: [{
    type: "Block",
    value: "This is a comment"
  }],
  body: {
    type: "BlockStatement",
    body: []
  },
  params: [],
  async: false,
  defaults: [],
  expression: false,
  generator: false,
  id: {
    type: "Identifier",
    name: "myFunction"
  },
  predicate: undefined,
  rest: undefined,
  returnType: undefined,
  typeParameters: undefined
});
console.log("type", functionExpression.getType()); // Should output: "FunctionExpression"
console.log("function", functionExpression); // Should output: "FunctionExpression"
```
/**
 * Groups the flat context map into a file-keyed structure.
 * Each file will have keys: variables, imports, exports.
 */
export const groupGraphByFile = (graph: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  for (const key in graph) {
    const entry = graph[key];
    const file = entry.file;
    if (!result[file]) {
      result[file] = { variables: {}, imports: {}, exports: {} };
    }
    const def = entry.originalDefinition.trim();
    if (def.startsWith("import")) {
      // Use the imported specifier as the key
      result[file].imports[entry.varName] = entry;
    } else if (def.startsWith("export")) {
      result[file].exports[entry.varName] = entry;
    } else {
      result[file].variables[entry.varName] = entry;
    }
  }
  return result;
}

export const removeIdKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeIdKeys);
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      if (key !== 'id') {
        acc[key] = removeIdKeys(obj[key]);
      }
      return acc;
    }, {} as any);
  }
  return obj;
};
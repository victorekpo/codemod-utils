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
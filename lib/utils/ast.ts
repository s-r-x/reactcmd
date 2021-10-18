import j from 'jscodeshift';

export const stringifyAst = (...args: Parameters<typeof j>): string => {
  const source = j(...args).toSource();
  if (Array.isArray(source)) {
    return source.join('\n');
  }
  return source;
};

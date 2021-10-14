import camelcase from 'camelcase';

export const pascalCase = (s: string) => camelcase(s, { pascalCase: true });

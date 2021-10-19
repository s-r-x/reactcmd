import type { PackageJson } from 'type-fest';

export type TPkg = PackageJson;
export type TPkgDeps = NonNullable<TPkg['dependencies']>;

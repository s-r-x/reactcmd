import type { PackageJson } from 'type-fest';
import { TAnyDict } from './utils';

export type TPkg = PackageJson & TAnyDict;
export type TPkgDeps = NonNullable<TPkg['dependencies']>;

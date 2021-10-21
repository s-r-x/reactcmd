import type { TPkg } from '../../typings/pkg';

export interface IPkgJsonReader {
  read(): Promise<TPkg>;
  getPath(): string;
}

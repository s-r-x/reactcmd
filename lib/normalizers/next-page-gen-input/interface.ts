import { IGenerateNextPageOptions } from '../../generators/next-page/interface';

export interface INextPageGenInputNormalizer {
  normalize(input: IGenerateNextPageOptions): Promise<IGenerateNextPageOptions>;
}

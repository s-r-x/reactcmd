import type { IGenerateComponentOptions as IInput } from '../../generators/component/interface';

export interface IComponentGenInputNormalizer {
  normalize(input: IInput): Promise<IInput>;
}

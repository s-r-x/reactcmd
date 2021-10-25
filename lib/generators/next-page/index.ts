import { injectable } from 'inversify';
import type { IGenerateNextPageOptions, INextPageGenerator } from './interface';

@injectable()
export class NextPageGenerator implements INextPageGenerator {
  async gen(args: IGenerateNextPageOptions) {
    console.log(args);
  }
}

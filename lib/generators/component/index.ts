import { inject, injectable } from 'inversify';
import { TStyleBuilderFactory } from '../../builders/style/interface';
import { TOKENS } from '../../ioc/tokens';
import { IComponentGenerator, IGenerateComponentOptions } from './interface';
import { ComponentGeneratorOptionsNormalizer } from './options-normalizer';

@injectable()
export class ComponentGenerator implements IComponentGenerator {
  constructor(
    @inject(TOKENS.styBldrFctry)
    private styleBuilderFactory: TStyleBuilderFactory,
    private optionsNormalizer: ComponentGeneratorOptionsNormalizer
  ) {}
  async gen(rawOpts: IGenerateComponentOptions): Promise<void> {
    const opts = await this.optionsNormalizer.normalize(rawOpts);
    console.log(opts);
    return Promise.resolve();
  }
}

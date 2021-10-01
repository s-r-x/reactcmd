import { inject, injectable } from 'inversify';
import { TStyleBuilderFactory } from '../../builders/style/interface';
import { TYPES } from '../../ioc/types';
import { IComponentGenerator } from './interface';

interface IGenerateDto {
  name: string;
  shouldUseTs?: boolean;
}

@injectable()
export class ComponentGenerator implements IComponentGenerator {
  constructor(
    @inject(TYPES.styBldrFctry)
    private styleBuilderFactory: TStyleBuilderFactory
  ) {}
  async gen(args: IGenerateDto): Promise<void> {
    console.log(args);
    const styleBuilder = this.styleBuilderFactory('styled-components');
    const styleArtifacts = styleBuilder.build({
      rootTag: 'span',
      rootClass: 'rot',
      ts: true,
    });
    console.log(styleArtifacts);
    return Promise.resolve();
  }
}

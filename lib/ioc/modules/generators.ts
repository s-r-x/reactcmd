import { ContainerModule } from 'inversify';
import { ComponentGenerator } from '../../generators/component';
import type { IComponentGenerator } from '../../generators/component/interface';
import { NextPageGenerator } from '../../generators/next-page';
import type { INextPageGenerator } from '../../generators/next-page/interface';
import { TOKENS } from '../tokens';

export const generatorsModule = new ContainerModule(bind => {
  bind<IComponentGenerator>(TOKENS.cmpGen).to(ComponentGenerator);
  bind<INextPageGenerator>(TOKENS.nextPageGen).to(NextPageGenerator);
});

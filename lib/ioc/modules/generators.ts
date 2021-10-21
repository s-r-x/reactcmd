import { ContainerModule } from 'inversify';
import { ComponentGenerator } from '../../generators/component';
import type { IComponentGenerator } from '../../generators/component/interface';
import { TOKENS } from '../tokens';

export const generatorsModule = new ContainerModule(bind => {
  bind<IComponentGenerator>(TOKENS.cmpGen).to(ComponentGenerator);
});

import { ContainerModule } from 'inversify';
import { ConfigSetuper } from '../../setupers/config';
import type { IConfigSetuper } from '../../setupers/config/interface';
import { TOKENS } from '../tokens';

export const setupersModule = new ContainerModule(bind => {
  bind<IConfigSetuper>(TOKENS.cfgSetuper).to(ConfigSetuper);
});

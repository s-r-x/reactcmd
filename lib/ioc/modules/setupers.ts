import { ContainerModule, interfaces } from 'inversify';
import { ConfigSetuper } from '../../setupers/config';
import { CFG_CMD_SETUPERS } from '../../setupers/config/constants';
import {
  ICfgCmdSetuper,
  ICfgSetuper,
  TCfgCmdSetuperFactory,
  TCfgCmdSetuperName,
} from '../../setupers/config/interface';
import { TOKENS } from '../tokens';

export const setupersModule = new ContainerModule(bind => {
  bind<ICfgSetuper>(TOKENS.cfgSetuper).to(ConfigSetuper);
  CFG_CMD_SETUPERS.forEach(([Setuper, name]) => {
    bind<ICfgCmdSetuper>(TOKENS.cfgCmdSetuper)
      // @ts-ignore
      .to(Setuper)
      .whenTargetNamed(name);
  });
  bind<interfaces.Factory<ICfgCmdSetuper>>(TOKENS.cfgCmdSetuperFctry).toFactory<
    ICfgCmdSetuper,
    [TCfgCmdSetuperName]
  >(
    ctx =>
      (name =>
        ctx.container.getNamed<ICfgCmdSetuper>(
          TOKENS.cfgCmdSetuper,
          name
        )) as TCfgCmdSetuperFactory
  );
});

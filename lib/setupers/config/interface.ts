import { TCliConfigFile as TConfig } from '../../typings/config';

export type TCfgCmdSetuperName = 'gc';
export interface ICfgSetuper {
  setup(): Promise<void>;
}
export interface ICfgCmdSetuper {
  setup(config: TConfig): Promise<TConfig>;
}
export type TCfgCmdSetuperFactory = (
  name: TCfgCmdSetuperName
) => ICfgCmdSetuper;

import { TCliConfigFile as TConfig } from '../../typings/config';

export type TCfgCmdSetuperName = 'gc';
export interface ICfgSetuper {
  setup(opts: ICfgSetuperOptions): Promise<void>;
}
export interface ICfgCmdSetuper {
  setup(config: TConfig): Promise<void>;
}
export type TCfgCmdSetuperFactory = (
  name: TCfgCmdSetuperName
) => ICfgCmdSetuper;

export interface ICfgSetuperOptions {
  dry?: boolean;
}

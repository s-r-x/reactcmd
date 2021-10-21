import { GenerateComponentCmdSetuper } from './command/generate-component';
import { TCfgCmdSetuperName } from './interface';

export const CFG_CMD_SETUPERS: [setuper: any, name: TCfgCmdSetuperName][] = [
  [GenerateComponentCmdSetuper, 'gc'],
];
const CFG_CMD_SETUPERS_NAMES_LIST: TCfgCmdSetuperName[] = ['gc'];
const CFG_CMD_SETUPERS_TRANSLATIONS: Record<TCfgCmdSetuperName, string> = {
  gc: 'generate component',
};
export const CFG_CMD_SETUPERS_SELECT_LIST: {
  name: string;
  value: TCfgCmdSetuperName;
}[] = CFG_CMD_SETUPERS_NAMES_LIST.map(value => ({
  value,
  name: CFG_CMD_SETUPERS_TRANSLATIONS[value],
}));

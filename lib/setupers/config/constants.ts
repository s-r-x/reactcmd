import { GenerateComponentCmdSetuper } from './command/generate-component';
import { GenerateNextPageCmdSetuper } from './command/generate-next-page';
import { TCfgCmdSetuperName } from './interface';

export const CFG_CMD_SETUPERS: [setuper: any, name: TCfgCmdSetuperName][] = [
  [GenerateComponentCmdSetuper, 'gc'],
  [GenerateNextPageCmdSetuper, 'gnp'],
];
const CFG_CMD_SETUPERS_NAMES_LIST: TCfgCmdSetuperName[] = ['gc', 'gnp'];
const CFG_CMD_SETUPERS_TRANSLATIONS: Record<TCfgCmdSetuperName, string> = {
  gc: 'generate component',
  gnp: 'generate next page',
};
export const CFG_CMD_SETUPERS_SELECT_LIST: {
  name: string;
  value: TCfgCmdSetuperName;
}[] = CFG_CMD_SETUPERS_NAMES_LIST.map(value => ({
  value,
  name: CFG_CMD_SETUPERS_TRANSLATIONS[value],
}));

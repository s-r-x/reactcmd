import type { CommandBuilder } from 'yargs';

export const command = 'generate <entity>';
export const aliases = ['g'];
export const desc = 'Generate entity';

export const builder: CommandBuilder = yargs =>
  yargs.commandDir('generate-cmds');

export const handler = (): void => {};

import type { CommandBuilder } from 'yargs';

export const command = 'gen <type>';
export const aliases = ['g'];

export const builder: CommandBuilder = yargs =>
  yargs.commandDir('generate-cmds');

export const handler = (): void => {};

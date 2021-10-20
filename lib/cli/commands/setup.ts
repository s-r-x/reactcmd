import type { CommandBuilder } from 'yargs';

export const command = 'setup <entity>';
export const aliases = ['s'];
export const desc = 'Setup';

export const builder: CommandBuilder = yargs => yargs.commandDir('setup-cmds');

export const handler = (): void => {};

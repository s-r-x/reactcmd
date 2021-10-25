import type { CommandBuilder } from 'yargs';

export const command = 'next <entity>';
export const desc = 'Generate next.js entity';

export const builder: CommandBuilder = yargs => yargs.commandDir('next-cmds');

export const handler = (): void => {};

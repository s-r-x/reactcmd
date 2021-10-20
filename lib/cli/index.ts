#!/usr/bin/env node
import 'reflect-metadata';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { enablePrettyErrors } from '../utils/enable-pretty-errors';

enablePrettyErrors();
yargs(hideBin(process.argv))
  // Use the commands directory to scaffold.
  .commandDir('commands')
  .demandCommand()
  // Enable strict mode.
  .strict()
  // Useful aliases.
  .alias({ h: 'help' }).argv;

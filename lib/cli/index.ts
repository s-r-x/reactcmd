#!/usr/bin/env node
import 'reflect-metadata';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { enablePrettyErrors } from '../utils/enable-pretty-errors';

enablePrettyErrors();
yargs(hideBin(process.argv))
  .scriptName('rcmd')
  .commandDir('commands')
  .strict()
  .alias({ h: 'help' }).argv;

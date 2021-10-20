import chalk from 'chalk';
import { injectable } from 'inversify';
import type { ILogger } from './interface';

@injectable()
export class Logger implements ILogger {
  log(msg: string) {
    console.log(msg);
  }
  success(msg: string) {
    console.log(chalk.green(msg));
  }
  warn(msg: string) {
    console.log(chalk.yellow(msg));
  }
  error(msg: string) {
    console.error(chalk.red(msg));
  }
}

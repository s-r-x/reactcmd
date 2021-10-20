import inquirer from 'inquirer';
import { injectable } from 'inversify';
import type { IUi, IConfirmOptions } from './interface';

@injectable()
export class Ui implements IUi {
  async confirm({
    name = 'confirm-name',
    message,
    initial,
  }: IConfirmOptions): Promise<boolean> {
    const result = await inquirer.prompt({
      type: 'confirm',
      name,
      default: initial,
      message,
    });
    return result[name] as boolean;
  }
}

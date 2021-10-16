import { ICliUi, IConfirmOptions } from './interface';
import inquirer from 'inquirer';

export class CliUi implements ICliUi {
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

import inquirer from 'inquirer';
import { injectable } from 'inversify';
import type { IUi, IConfirmOptions, ITextInputOptions } from './interface';

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
  async textInput({
    name = 'text-input-name',
    message,
    initial,
  }: ITextInputOptions): Promise<string> {
    const result = await inquirer.prompt({
      type: 'input',
      name,
      default: initial,
      message,
    });
    return result[name] as string;
  }
  select: IUi['select'] = async ({
    name = 'select-name',
    message,
    options,
    initial,
  }) => {
    const result: any = await inquirer.prompt({
      type: 'list',
      name,
      message,
      choices: options,
      default: initial,
    });
    return result[name];
  };
}

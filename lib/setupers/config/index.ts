import { inject, injectable } from 'inversify';
import { IEnvAnalyzer } from '../../analyzers/env/interface';
import { IStylingAnalyzer } from '../../analyzers/styling/interface';
import {
  AVAILABLE_STYLING_OPTIONS,
  CSS_MODULES_SUPPORTED_STYLINGS,
} from '../../constants/styling';
import { TOKENS } from '../../ioc/tokens';
import { TLang } from '../../typings';
import { TCliConfigFile } from '../../typings/config';
import { TStylingStrategy } from '../../typings/styling';
import { IUi } from '../../ui/interface';
import { IConfigSetuper } from './interface';

@injectable()
export class ConfigSetuper implements IConfigSetuper {
  constructor(
    @inject(TOKENS.ui) private ui: IUi,
    @inject(TOKENS.styleAnlz) private styleAnalyzer: IStylingAnalyzer,
    @inject(TOKENS.envAnalyzer) private envAnalyzer: IEnvAnalyzer
  ) {}
  private config: TCliConfigFile = {};
  async setup(): Promise<void> {
    await this.selectSrcDir();
    await this.selectLanguage();
    await this.selectStyling();
  }
  private async selectStyling() {
    const initial = await this.styleAnalyzer.determineStylingStrategy();
    const style = await this.ui.select<TStylingStrategy>({
      message: 'Styling:',
      options: AVAILABLE_STYLING_OPTIONS.map(value => ({
        value,
        name: value === 'sc' ? 'styled-components' : value,
      })),
      initial,
    });
    console.log(style);
    if (CSS_MODULES_SUPPORTED_STYLINGS.includes(style)) {
      const useCssModules = await this.ui.confirm({
        message: 'Use CSS modules?',
        initial: true,
      });
      console.log(useCssModules);
    }
  }
  private async selectSrcDir() {
    const initial = await this.envAnalyzer.determineSourceDir();
    const result = await this.ui.textInput({
      message:
        'Source folder (absolute or relative to the project root folder)',
      initial,
    });
    console.log(result);
  }
  private async selectLanguage() {
    const initial = await this.envAnalyzer.determineLang();
    const lang = await this.ui.select<TLang>({
      message: 'Language:',
      options: [{ value: 'ts' }, { value: 'js' }],
      initial,
    });
    console.log(lang);
  }
}
